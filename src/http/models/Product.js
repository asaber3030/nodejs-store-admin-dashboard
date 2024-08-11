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
class Product {
    static find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.product.findUnique({
                where: { id },
                include: {
                    category: true,
                    brand: true,
                    pictures: true
                }
            });
        });
    }
    static all() {
        return __awaiter(this, arguments, void 0, function* (search = '', skip = 0, take = 10, orderBy = 'id', orderType = 'desc') {
            return yield db_1.default.product.findMany({
                where: {
                    OR: [
                        { name: { contains: search } },
                        { description: { contains: search } },
                    ]
                },
                skip,
                take,
                orderBy: {
                    [orderBy]: orderType
                }
            });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.product.delete({
                where: { id }
            });
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.product.update({
                where: { id },
                data
            });
        });
    }
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.product.create({
                data
            });
        });
    }
}
Product.selectors = {};
exports.default = Product;
