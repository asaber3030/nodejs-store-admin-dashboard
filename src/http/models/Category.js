"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../utlis/db"));
class Category {
    static find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.category.findUnique({
                where: { id },
                select: Object.assign(Object.assign({}, Category.selectors), { _count: { select: { products: true } } })
            });
        });
    }
    static all(skip = 0, take = 10, orderBy = 'id', orderType = 'desc') {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.category.findMany({
                skip,
                take,
                select: {
                    id: true,
                    name: true,
                    icon: true,
                    keywords: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: { select: { products: true } },
                },
                orderBy: {
                    [orderBy]: orderType
                }
            });
        });
    }
    static products(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.product.findMany({
                where: { categoryId }
            });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.category.delete({
                where: { id }
            });
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.category.update({
                where: { id },
                data
            });
        });
    }
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.category.create({
                data
            });
        });
    }
}
Category.selectors = {
    id: true,
    name: true,
    icon: true,
    keywords: true,
    createdAt: true,
    updatedAt: true
};
exports.default = Category;
