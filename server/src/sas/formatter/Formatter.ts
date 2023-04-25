// @@
// blank lines
// keyword arg1=  arg2= ;

import { Token } from "../Lexer";
import { LexerEx } from "../LexerEx";
import { Model } from "../Model";
import { Change } from "../SyntaxProvider";
import { TextRange } from "../utils";
import {
  Argument,
  BlankLine,
  Comment,
  DataLines,
  Expression,
  CodeBlock,
  Section,
  SEMICOLON,
  Statement,
  StatementPart,
} from "./Formatable";

type StatementParts = Array<StatementPart>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Formatter {
  private lexer: LexerEx;

  private codeBlocks: Array<CodeBlock> = [];

  constructor(private model: Model) {
    this.lexer = new LexerEx(model);
  }

  public format(formatSettings: unknown): string {
    this.parseStatements();
    this.parseSections();
    return this.doFormat(formatSettings);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private doFormat(_formatSettings: unknown): string {
    let formatted = "";
    const indentLevel = 0;

    if (this.codeBlocks.length > 0) {
      this.codeBlocks.forEach((statement) => {
        formatted += statement.format(indentLevel);
      });
    }
    return formatted;
  }

  // reorganize with hierarchy
  // candidate name: group
  private parseSections() {
    // identify hierachy of statements and reorganize this.statements
    // 1. recoganize section statement
    const printables = this.codeBlocks;
    this.codeBlocks = [];

    for (let i = 0; i < printables.length; i++) {
      const printable = printables[i];
      if (
        printable instanceof Statement &&
        printable.keyword !== undefined &&
        printable.keyword.token.type === "sec-keyword"
      ) {
        const endLine =
          this.lexer.getFoldingBlock(printable.getStartLine())?.endLine ?? 0;
        const endIndex = this.getSectionEndIndex(printables, i, endLine);
        const section = this.newSectionInstance(printables, i, endIndex);
        this.codeBlocks.push(section);
        i = endIndex;
      } else {
        this.codeBlocks.push(printable);
      }
    }
  }

  private getSectionEndIndex(
    allStatements: Array<Statement>,
    beginIndex: number,
    endLine: number
  ): number {
    for (let i = beginIndex + 1; i < allStatements.length; i++) {
      const statement = allStatements[i];

      if (statement.getEndLine() === endLine) {
        return i;
      }
    }

    return -1;
  }

  private newSectionInstance(
    allStatements: Array<Statement>,
    beginIndex: number,
    endIndex: number
  ): Section {
    let statement = allStatements[beginIndex];
    const section = new Section(statement);

    for (let i = beginIndex + 1; i <= endIndex - 1; i++) {
      statement = allStatements[i];
      // 此处递归调用生成其他的section
      section.addStatement(statement);
    }

    statement = allStatements[endIndex];
    if (statement.keyword?.token.type === "sec-keyword") {
      section.addEndStatement(statement);
    } else {
      section.addStatement(statement);
    }

    return section;
  }

  // parse doc to a list of formattable objects (comments, statements)
  private parseStatements(): void {
    const lineCount = this.model.getLineCount();
    const columnCount = this.model.getColumnCount(lineCount - 1);
    const fullTextChange = this.generateFullTextChange(lineCount, columnCount);
    this.lexer.start(fullTextChange);

    let token;
    let previousToken: Token | undefined = undefined;
    let statementParts: StatementParts = [];

    for (;;) {
      token = this.lexer.getNext();

      if (!token) {
        if (statementParts.length > 0) {
          this.parseStatement(statementParts);
        }

        break;
      }

      if (this.isCommentToken(token)) {
        statementParts = this.handleComment(
          token,
          statementParts,
          previousToken
        );
      } else {
        if (this.canParseStatement(previousToken)) {
          this.parseStatement(statementParts);
          statementParts = [];
        }

        this.parseBlankLine(previousToken, token, statementParts);

        statementParts.push(this.generateStatementPart(token));
      }

      previousToken = token;
    }
  }

  private parseBlankLine(
    previousToken: Token | undefined,
    token: Token,
    statementParts: StatementParts
  ): void {
    if (statementParts.length > 0 || previousToken === undefined) {
      return;
    } else if (token.start.line - previousToken.end.line > 1) {
      const blankLine = new BlankLine(previousToken.end.line + 1);
      this.codeBlocks.push(blankLine);
    }
  }

  private generateFullTextChange(
    lineCount: number,
    columnCount: number
  ): Change {
    return {
      text: "",
      removedText: "",
      oldRange: {
        start: { line: 0, column: 0 },
        end: { line: 0, column: 0 },
      },
      newRange: {
        start: { line: 0, column: 0 },
        end: { line: lineCount - 1, column: columnCount },
      },
    };
  }

  private generateStatementPart(
    token: Token,
    commentToken?: Token
  ): StatementPart {
    const literal = this.getTokenText(token) ?? "";
    const comment =
      commentToken === undefined ? undefined : this.getTokenText(commentToken);
    return { token, literal, comment };
  }

  private canParseStatement(previousToken?: Token): boolean {
    return !!previousToken && previousToken.text === SEMICOLON;
  }

  private parseComment(token: Token) {
    const startLine = token.start.line;
    const endLine = token.end.line;
    const lines: string[] = [];
    let line: string;

    for (let i = startLine; i <= endLine; i++) {
      line = this.model.getLine(i);
      if (i === startLine) {
        line = line.substring(token.start.column);
      }
      if (i === endLine) {
        line = line.substring(0, token.end.column);
      }

      lines.push(line.trim());
    }

    this.codeBlocks.push(new Comment(lines, token));
  }

  private newStatementInstance(
    firstPart?: StatementPart,
    lastPart?: StatementPart
  ): Statement {
    return new Statement(firstPart, lastPart);
  }

  private parseStatement(statementParts: StatementParts) {
    let statement;
    const partCount = statementParts.length;
    const firstPart = statementParts[0]; // in general, it should be keyword
    const lastPart = statementParts[statementParts.length - 1]; // it should be a semicolon, but may have a following line comment

    if (partCount === 1) {
      // null Statement (;)
      statement = this.newStatementInstance(undefined, firstPart);
    } else if (partCount > 1) {
      if (
        firstPart.token.type.indexOf("keyword") > -1 ||
        firstPart.token.type.indexOf("macro") > -1
      ) {
        statement = this.newStatementInstance(firstPart, lastPart);

        const args = this.parseArguments(
          statementParts.slice(1, statementParts.length - 1)
        );
        statement.arguments = args;
      } else {
        if (firstPart.token.type === "cards-data") {
          statement = new DataLines(firstPart, lastPart);
        } else {
          // expression
          statement = new Expression(lastPart);
          const args = this.parseArguments(
            statementParts.slice(0, statementParts.length - 1)
          );
          statement.arguments = args;
        }
      }
    }

    if (statement !== undefined) {
      this.codeBlocks.push(statement);
    }
  }

  private parseArguments(argumentParts: StatementParts): Argument[] {
    const args: Argument[] = [];
    const partCount = argumentParts.length;

    if (partCount <= 2) {
      argumentParts.forEach((part) => {
        const argument = new Argument(
          this.getTokenText(part.token),
          part.comment
        );
        args.push(argument);
      });
    } else {
      for (let i = 0; i < partCount; i++) {
        const currentPart = argumentParts[i];
        const nextPart = i < partCount - 1 ? argumentParts[i + 1] : null;

        if (nextPart === null) {
          args.push(new Argument(currentPart.literal, currentPart.comment));
        } else {
          const argument = new Argument(
            currentPart.literal,
            currentPart.comment
          );

          if (nextPart.literal === "=") {
            const valuePart = i < partCount - 2 ? argumentParts[i + 2] : null;
            argument.setValue(valuePart === null ? " " : valuePart.literal);
            i = valuePart === null ? partCount : i + 2;
          }

          args.push(argument);
        }
      }
    }

    return args;
  }

  private isCommentToken(token: Token): boolean {
    return token.type.indexOf("comment") > -1;
  }

  private handleComment(
    commentToken: Token,
    statementParts: StatementParts,
    previousToken?: Token
  ): StatementParts {
    let result = [...statementParts];

    if (previousToken === undefined) {
      // is beginning with block comment or block comment is not in a statement
      this.parseComment(commentToken);
    } else if (statementParts.length === 0) {
      this.parseBlankLine(previousToken, commentToken, result);
      this.parseComment(commentToken);
    } else if (this.isSameLineComment(commentToken, previousToken)) {
      const newStatementPart = this.generateStatementPart(
        previousToken,
        commentToken
      );
      result[result.length - 1] = newStatementPart;

      if (this.canParseStatement(previousToken)) {
        this.parseStatement(result);
        result = [];
      }
    } else {
      if (this.canParseStatement(previousToken)) {
        this.parseStatement(result);
        result = [];

        this.parseBlankLine(previousToken, commentToken, result);

        this.parseComment(commentToken);
      } else {
        // block comment is inside of a statement
        result.push(this.generateStatementPart(commentToken));
      }
    }

    return result;
  }

  /*
    below two comment is same line comment:
    1. output pf70; // print something
    2. output out= univout mean= popnmean median= popn50 // median
		   pctlpre= pop_  pctlpts= 50, 95 to 100 by 2.5;
  */
  private isSameLineComment(
    commentToken: Token,
    previousToken: Token | undefined
  ): boolean {
    return (
      !!previousToken &&
      this.isSingleLineComment(commentToken) &&
      this.areTokensInSameLine(commentToken, previousToken)
    );
  }

  private isSingleLineComment(commentToken: Token): boolean {
    return commentToken.start.line === commentToken.end.line;
  }

  private areTokensInSameLine(token1: Token, token2: Token) {
    return (
      token1.end.line === token2.start.line &&
      token1.end.line === token2.end.line
    );
  }

  // private handleSameLineComment(
  //   commentToken: Token,
  //   statementParts: Array<StatementPart>
  // ): StatementParts {
  //   const result = [...statementParts];

  //   const commentText = this.getTokenText(commentToken);
  //   result[result.length - 1].comment = commentText;

  //   return result;
  // }

  private getTokenText(token: Token): string {
    const textRange: TextRange = { start: token.start, end: token.end };
    return this.model.getText(textRange);
  }
}
