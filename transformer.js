"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var path = require("path");
function transformer(program) {
    return function (context) { return function (file) { return visitNodeAndChildren(file, program, context); }; };
}
exports.default = transformer;
function visitNodeAndChildren(node, program, context) {
    return ts.visitEachChild(visitNode(node, program), function (childNode) { return visitNodeAndChildren(childNode, program, context); }, context);
}
function visitNode(node, program) {
    var typeChecker = program.getTypeChecker();
    if (!isKeysCallExpression(node, typeChecker)) {
        return node;
    }
    if (!node.typeArguments) {
        return ts.createArrayLiteral([]);
    }
    var type = typeChecker.getTypeFromTypeNode(node.typeArguments[0]);
    var properties = typeChecker.getPropertiesOfType(type);
    return ts.createStringLiteral(properties.reduce(function (acc, prop) { return acc + "/:" + prop.name; }, ''));
    // return ts.createArrayLiteral(properties.map(property => ts.createLiteral(property.name)));
}
var indexTs = path.join(__dirname, 'index.ts');
function isKeysCallExpression(node, typeChecker) {
    if (node.kind !== ts.SyntaxKind.CallExpression) {
        return false;
    }
    var signature = typeChecker.getResolvedSignature(node);
    if (typeof signature === 'undefined') {
        return false;
    }
    var declaration = signature.declaration;
    return !!declaration
        && (path.join(declaration.getSourceFile().fileName) === indexTs)
        && !!declaration['name']
        && (declaration['name'].getText() === 'keys');
}
