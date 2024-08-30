"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1874],{4175:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>d,contentTitle:()=>r,default:()=>h,frontMatter:()=>o,metadata:()=>a,toc:()=>l});var t=s(4848),i=s(8453);const o={sidebar_position:5},r="Running SAS Code by Task",a={id:"Features/runningTask",title:"Running SAS Code by Task",description:"Run selected code or all code in active editor",source:"@site/docs/Features/runningTask.md",sourceDirName:"Features",slug:"/Features/runningTask",permalink:"/vscode-sas-extension/Features/runningTask",draft:!1,unlisted:!1,editUrl:"https://github.com/sassoftware/vscode-sas-extension/tree/main/website/docs/Features/runningTask.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"defaultSidebar",previous:{title:"Running SAS Code",permalink:"/vscode-sas-extension/Features/running"},next:{title:"Fixing Errors and Warnings",permalink:"/vscode-sas-extension/Features/errorsWarnings"}},d={},l=[{value:"Run selected code or all code in active editor",id:"run-selected-code-or-all-code-in-active-editor",level:2},{value:"Custom task to run specified SAS file in workspace",id:"custom-task-to-run-specified-sas-file-in-workspace",level:2},{value:"Custom task to run sas code with preamble and postamble added",id:"custom-task-to-run-sas-code-with-preamble-and-postamble-added",level:2},{value:"Assigning keyboard shortcuts to tasks",id:"assigning-keyboard-shortcuts-to-tasks",level:2}];function c(e){const n={code:"code",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"running-sas-code-by-task",children:"Running SAS Code by Task"})}),"\n",(0,t.jsx)(n.h2,{id:"run-selected-code-or-all-code-in-active-editor",children:"Run selected code or all code in active editor"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["Open the command palette (",(0,t.jsx)(n.code,{children:"F1"}),", or ",(0,t.jsx)(n.code,{children:"Ctrl+Shift+P"})," on Windows or Linux, or ",(0,t.jsx)(n.code,{children:"Shift+CMD+P"})," on OSX) and execute the ",(0,t.jsx)(n.code,{children:"Tasks: Run Task"})," command."]}),"\n",(0,t.jsxs)(n.li,{children:["Select the ",(0,t.jsx)(n.strong,{children:"sas"})," task category and then select the ",(0,t.jsx)(n.strong,{children:"sas: Run sas file"})," task."]}),"\n",(0,t.jsx)(n.li,{children:"This task automatically runs selected code or all code in active editor (depending on whether you have selected any code)."}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"custom-task-to-run-specified-sas-file-in-workspace",children:"Custom task to run specified SAS file in workspace"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["Open the command palette (",(0,t.jsx)(n.code,{children:"F1"}),", or ",(0,t.jsx)(n.code,{children:"Ctrl+Shift+P"})," on Windows or Linux, or ",(0,t.jsx)(n.code,{children:"Shift+CMD+P"})," on OSX) and execute the ",(0,t.jsx)(n.code,{children:"Tasks: Configure Task"})," command."]}),"\n",(0,t.jsxs)(n.li,{children:["Select ",(0,t.jsx)(n.strong,{children:"sas: Run sas file"})," task."]}),"\n",(0,t.jsxs)(n.li,{children:["The ",(0,t.jsx)(n.code,{children:"tasks.json"})," file opens with an initial task definition:"]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-json",children:'{\n  "version": "2.0.0",\n  "tasks": [\n    {\n      "type": "sas",\n      "task": "Run sas file",\n      "problemMatcher": [],\n      "label": "sas: Run sas file"\n    }\n  ]\n}\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"3",children:["\n",(0,t.jsxs)(n.li,{children:["Add the ",(0,t.jsx)(n.strong,{children:"file"})," field and assign a SAS file name to it."]}),"\n",(0,t.jsxs)(n.li,{children:["Update the ",(0,t.jsx)(n.strong,{children:"label"})," field. Here is an example of the final task definition:"]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-json",children:'{\n  "version": "2.0.0",\n  "tasks": [\n    {\n      "type": "sas",\n      "task": "Run sas file",\n      "file": "my.sas",\n      "problemMatcher": [],\n      "label": "run my.sas code"\n    }\n  ]\n}\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"5",children:["\n",(0,t.jsxs)(n.li,{children:["Save ",(0,t.jsx)(n.code,{children:"tasks.json"}),"."]}),"\n",(0,t.jsxs)(n.li,{children:["This custom task can be run by ",(0,t.jsx)(n.strong,{children:"Run Tasks..."})," in the global ",(0,t.jsx)(n.strong,{children:"Terminal"})," menu"]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"Note"}),":"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"If you do not specify a file property or you assign an empty string to the file property in your task definition, the custom task will use the default properties of a built-in task."}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"custom-task-to-run-sas-code-with-preamble-and-postamble-added",children:"Custom task to run sas code with preamble and postamble added"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["Open the command palette (",(0,t.jsx)(n.code,{children:"F1"}),", or ",(0,t.jsx)(n.code,{children:"Ctrl+Shift+P"})," on Windows or Linux, or ",(0,t.jsx)(n.code,{children:"Shift+CMD+P"})," on OSX) and execute the ",(0,t.jsx)(n.code,{children:"Tasks: Configure Task"})," command."]}),"\n",(0,t.jsxs)(n.li,{children:["Select ",(0,t.jsx)(n.strong,{children:"sas: Run sas file"})," task."]}),"\n",(0,t.jsxs)(n.li,{children:["Add ",(0,t.jsx)(n.strong,{children:"preamble"})," and/or ",(0,t.jsx)(n.strong,{children:"postamble"})," properties and enter the SAS code."]}),"\n",(0,t.jsxs)(n.li,{children:["if a file is specified, the ",(0,t.jsx)(n.strong,{children:"preamble"})," and ",(0,t.jsx)(n.strong,{children:"postamble"})," will be added in the code from this file when this task is executed."]}),"\n",(0,t.jsxs)(n.li,{children:["If ",(0,t.jsx)(n.strong,{children:"file"})," is absent, then ",(0,t.jsx)(n.strong,{children:"preamble"})," and ",(0,t.jsx)(n.strong,{children:"postamble"})," will be added in the selected code (if you have selected code) or all code in active editor when this task is executed."]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-json",children:'{\n  "version": "2.0.0",\n  "tasks": [\n    {\n      "type": "sas",\n      "task": "Run sas file",\n      "file": "code.sas",\n      "preamble": "some code*",\n      "postamble": "some code*",\n      "problemMatcher": [],\n      "label": "Run additional code"\n    }\n  ]\n}\n'})}),"\n",(0,t.jsx)(n.h2,{id:"assigning-keyboard-shortcuts-to-tasks",children:"Assigning keyboard shortcuts to tasks"}),"\n",(0,t.jsx)(n.p,{children:"If you need to run a task frequently, you can define a keyboard shortcut for the task."}),"\n",(0,t.jsxs)(n.p,{children:["For example, to assign ",(0,t.jsx)(n.code,{children:"Ctrl+H"})," to the ",(0,t.jsx)(n.strong,{children:"run additional code"})," task from above, add the following to your keybindings.json file:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-json",children:'{\n  "key": "ctrl+h",\n  "command": "workbench.action.tasks.runTask",\n  "args": "Run additional code"\n}\n'})})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>r,x:()=>a});var t=s(6540);const i={},o=t.createContext(i);function r(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),t.createElement(o.Provider,{value:n},e.children)}}}]);