import { StateEffect } from "@codemirror/state";
import { DecorationSet } from "@codemirror/view";

export const decorationUpdateEffect = StateEffect.define<DecorationSet>();
