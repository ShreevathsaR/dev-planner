var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { adminAuth } from "./firebase-admin";
export function createContext(_a) {
    return __awaiter(this, arguments, void 0, function* ({ req }) {
        var _b;
        const token = (_b = req.headers.get('authorization')) === null || _b === void 0 ? void 0 : _b.split("Bearer ")[1];
        let user = null;
        if (token) {
            try {
                const decodedToken = yield adminAuth.verifyIdToken(token);
                user = decodedToken;
            }
            catch (err) {
                console.warn("Invalid Firebase token", err);
            }
        }
        return {
            user,
        };
    });
}
