"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var transformer_1 = require("../transformer");
function compile(filePaths, writeFileCallback) {
    var program = ts.createProgram(filePaths, {
        strict: true,
        noEmitOnError: true,
        suppressImplicitAnyIndexErrors: true,
        target: ts.ScriptTarget.ES5
    });
    var transformers = {
        before: [transformer_1.default(program)],
        after: []
    };
    var _a = program.emit(undefined, writeFileCallback, undefined, false, transformers), emitSkipped = _a.emitSkipped, diagnostics = _a.diagnostics;
    if (emitSkipped) {
        throw new Error(diagnostics.map(function (diagnostic) { return diagnostic.messageText; }).join('\n'));
    }
}
exports.compile = compile;
