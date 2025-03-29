"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentField = void 0;
const typeorm_1 = require("typeorm");
const Document_1 = require("./Document");
let DocumentField = class DocumentField {
};
exports.DocumentField = DocumentField;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DocumentField.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DocumentField.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DocumentField.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], DocumentField.prototype, "confidence", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'simple-json' }),
    __metadata("design:type", Object)
], DocumentField.prototype, "coordinates", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Document_1.Document, document => document.fields),
    __metadata("design:type", Document_1.Document)
], DocumentField.prototype, "document", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DocumentField.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DocumentField.prototype, "updatedAt", void 0);
exports.DocumentField = DocumentField = __decorate([
    (0, typeorm_1.Entity)()
], DocumentField);
//# sourceMappingURL=DocumentField.js.map