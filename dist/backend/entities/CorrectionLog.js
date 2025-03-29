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
exports.CorrectionLog = void 0;
const typeorm_1 = require("typeorm");
const Document_1 = require("./Document");
const User_1 = require("./User");
let CorrectionLog = class CorrectionLog {
};
exports.CorrectionLog = CorrectionLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CorrectionLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Document_1.Document),
    __metadata("design:type", Document_1.Document)
], CorrectionLog.prototype, "document", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    __metadata("design:type", User_1.User)
], CorrectionLog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CorrectionLog.prototype, "fieldName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CorrectionLog.prototype, "originalValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CorrectionLog.prototype, "correctedValue", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CorrectionLog.prototype, "createdAt", void 0);
exports.CorrectionLog = CorrectionLog = __decorate([
    (0, typeorm_1.Entity)()
], CorrectionLog);
//# sourceMappingURL=CorrectionLog.js.map