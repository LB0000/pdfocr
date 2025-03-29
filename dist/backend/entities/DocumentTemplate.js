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
exports.DocumentTemplate = void 0;
const typeorm_1 = require("typeorm");
const FieldDefinition_1 = require("./FieldDefinition");
let DocumentTemplate = class DocumentTemplate {
};
exports.DocumentTemplate = DocumentTemplate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DocumentTemplate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DocumentTemplate.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DocumentTemplate.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => FieldDefinition_1.FieldDefinition, field => field.template),
    __metadata("design:type", Array)
], DocumentTemplate.prototype, "fields", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DocumentTemplate.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DocumentTemplate.prototype, "updatedAt", void 0);
exports.DocumentTemplate = DocumentTemplate = __decorate([
    (0, typeorm_1.Entity)()
], DocumentTemplate);
//# sourceMappingURL=DocumentTemplate.js.map