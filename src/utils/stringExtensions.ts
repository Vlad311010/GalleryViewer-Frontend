import { CONSTANTS } from "@/Constants";

export {};

declare global {
  interface String {
    capitalize(): string;
    normilizeTag(): string;
  }
}

String.prototype.capitalize = function (): string {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.normilizeTag = function (): string {
  return this.replaceAll(CONSTANTS.TAG_SEPARATOR_CHARACTER, CONSTANTS.SPACE_CHARACTER).toLowerCase();
};