/*
Global statements can be specified in a SAS program in the following locations:
  open code
  a DATA step
  a PROC step
  a SAS macro

<link>https://go.documentation.sas.com/doc/en/pgmsascdc/v_034/lestmtsglobal/n12y6ohua6d9nxn1q1v8kr63t0e5.htm</link>

Global statements are not executable statements; they are declarative statements that take effect as soon as SAS compiles the program statements. 
*/

import { Token } from "../Lexer";

export const SEMICOLON = ";";
export const CRLF = "\r\n";

export interface Formattable {
  format: (indentLevel: number, formatSettings?: unknown) => string;
}

export interface CodeBlock extends Formattable {
  getStartLine(): number;
  getEndLine(): number;
}

export interface StatementPart {
  token: Token;
  literal: string; // the full text of this token. note that token.text may be not full text.
  comment?: string;
}

export class Statement implements CodeBlock {
  public keyword?: StatementPart; // Assignment statement has not keyword
  public arguments?: Array<Argument>;
  public delimiter?: StatementPart; // it may be ';', or '; //xxxx'

  constructor(firstPart?: StatementPart, lastPart?: StatementPart) {
    this.keyword = firstPart;
    this.delimiter = lastPart;
  }

  public format(indentLevel: number): string {
    const indent = constructIndent(indentLevel);

    const argumentsString =
      this.arguments !== undefined && this.arguments.length > 0
        ? " " +
          this.arguments
            .map((argument) => {
              return argument.format(indentLevel + 1);
            })
            .join(" ")
        : "";

    const keyword = literalizeWithComment(this.keyword);
    const delimiter = literalizeWithComment(this.delimiter);

    const formatted = indent + keyword + argumentsString + delimiter + CRLF;

    return formatted;
  }

  public getStartLine(): number {
    if (this.keyword !== undefined) {
      return this.keyword.token.start.line;
    } else {
      return -1;
    }
  }

  public getEndLine(): number {
    if (this.delimiter !== undefined) {
      return this.delimiter.token.end.line;
    } else {
      return -1;
    }
  }
}

export class Expression extends Statement {
  constructor(lastPart: StatementPart) {
    super(undefined, lastPart);
  }

  public getStartLine(): number {
    if (this.keyword !== undefined) {
      return this.keyword.token.start.line;
    } else {
      return -1;
    }
  }

  public getEndLine(): number {
    if (this.delimiter !== undefined) {
      return this.delimiter.token.end.line;
    } else {
      return -1;
    }
  }

  public format(indentLevel: number): string {
    const indent = constructIndent(indentLevel);

    const expression =
      this.arguments !== undefined && this.arguments.length > 0
        ? this.arguments
            .map((argument) => {
              return argument.format(indentLevel + 1);
            })
            .join(" ")
        : "";
    const delimiter = literalizeWithComment(this.delimiter);
    return indent + expression + delimiter + CRLF;
  }
}

/* 
  Below statements are Section statements which can include many other statements
    DATA (DATA step statement), 
    PROC (PROC step statement), 
    %MACRO (Macro definition statement)
    DO, 
    DO UNTIL, 
    DO WHILE
*/
export class Section implements CodeBlock {
  private printables: Array<CodeBlock> = [];
  private endStatement?: Statement;

  constructor(private beginStatement: Statement) {}

  public addStatement(statement: Statement): void {
    this.printables.push(statement);
  }

  public addEndStatement(statement: Statement): void {
    this.endStatement = statement;
  }

  public format(indentLevel: number): string {
    const indent = constructIndent(indentLevel);

    const begin = this.beginStatement.format(indentLevel);
    let middle = "";
    if (this.printables.length > 0) {
      this.printables.forEach((statement) => {
        middle += statement.format(indentLevel + 1);
      });
    }
    const end = this.endStatement?.format(indentLevel) ?? "";

    return indent + begin + middle + end;
  }

  public getStartLine(): number {
    return this.beginStatement.getStartLine();
  }

  public getEndLine(): number {
    return this.endStatement === undefined
      ? this.printables[this.printables.length - 1].getEndLine()
      : this.endStatement.getEndLine();
  }
}

/*
  making this clas extends from Statement to make it possible put into statement list in Formatter class
*/
export class BlankLine implements CodeBlock {
  constructor(private lineNumber: number) {}

  public getStartLine(): number {
    return this.lineNumber;
  }

  public getEndLine(): number {
    return this.lineNumber;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public format(_indentLevel: number): string {
    return CRLF;
  }
}

export class Argument implements Formattable {
  protected name: string;
  // <LITERAL_ARGUMENT> argument-1
  public literal?: string;
  // argument-1 <options>
  protected options?: Array<Option>;
  // argument-1=value-1
  protected value?: string;
  // argument-1 <, argument-2, ...>
  // default is space(' ')
  protected separator?: string;
  protected comment?: string;

  constructor(name: string, comment?: string) {
    this.name = name;
    this.comment = comment;
  }

  public addOption(option: Option): void {
    if (!this.options) {
      this.options = [];
    }

    this.options.push(option);
  }

  public setValue(value?: string): void {
    this.value = value;
  }

  public setSeparator(separator: string): void {
    this.separator = separator;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public format(_indentLevel: number): string {
    // const indent = constructIndent(indentLevel);
    const separator = this.separator ?? "";

    if (this.value !== undefined) {
      return `${this.name}=${this.value}${separator}`;
    } else {
      return `${this.name}${separator}`;
    }
  }
}

export class Option {
  protected key: string;
  protected values?: Array<string>;

  constructor(key: string) {
    this.key = key;
  }

  public addValue(value: string): void {
    if (value === "") {
      return;
    }

    if (!this.values) {
      this.values = [];
    }
    this.values.push(value);
  }
}

// PL/1-style comment (/* */)
// Comment statement (*...;)
// Macro comment (%*...;)
export class Comment extends Statement {
  constructor(private lines: string[], private token: Token) {
    super();
  }

  public getStartLine(): number {
    return this.token.start.line;
  }

  public getEndLine(): number {
    return this.token.end.line;
  }

  public format(indentLevel: number): string {
    const indent = constructIndent(indentLevel);

    const formatted = this.lines
      .map((line) => {
        return indent + line.trim() + CRLF;
      })
      .join("");

    return formatted;
  }
}

/*
  Data for DATALINES (alias: CARDS, LINES) statement
*/
export class DataLines extends Statement {
  private data: string;
  constructor(firstPart: StatementPart, lastPart: StatementPart) {
    super(undefined, lastPart);
    this.data = firstPart.literal;
  }

  public format(): string {
    return this.data + literalizeWithComment(this.delimiter) + CRLF;
  }
}

function literalizeWithComment(part?: StatementPart): string {
  if (part === undefined) {
    return "";
  }

  const literal = part.literal;
  const comment = part.comment;

  if (comment !== undefined) {
    return literal + " " + comment;
  } else {
    return literal;
  }
}

// export class IfThenElseStatement implements Statement {
//   private expression: string;
//   private then: string;
//   private else: string;

//   constructor();

//   public format(indentLevel: number, formatSettings: any): string {
//     return "";
//   }
// }

export function constructIndent(indentLevel: number): string {
  let indent = "";

  for (let i = 1; i <= indentLevel; i++) {
    indent += "    ";
  }

  return indent;
}
