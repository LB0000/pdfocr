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
exports.FieldDefinition = void 0;
const typeorm_1 = require("typeorm");
const DocumentTemplate_1 = require("./DocumentTemplate");
let FieldDefinition = class FieldDefinition {
};
exports.FieldDefinition = FieldDefinition;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FieldDefinition.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FieldDefinition.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FieldDefinition.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FieldDefinition.prototype, "fieldType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FieldDefinition.prototype, "validationRegex", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], FieldDefinition.prototype, "coordinates", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => DocumentTemplate_1.DocumentTemplate, template => template.fields),
    __metadata("design:type", DocumentTemplate_1.DocumentTemplate)
], FieldDefinition.prototype, "template", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FieldDefinition.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FieldDefinition.prototype, "updatedAt", void 0);
exports.FieldDefinition = FieldDefinition = __decorate([
    (0, typeorm_1.Entity)()
], FieldDefinition);
//# sourceMappingURL=FieldDefinition.js.map