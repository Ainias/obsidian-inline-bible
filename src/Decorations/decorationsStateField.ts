import { EditorState, StateField, Transaction } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView } from "@codemirror/view";
import { decorationUpdateEffect } from "./decorationUpdateEffect";

export const decorationsStateField = StateField.define<DecorationSet>({
	create(state: EditorState){
		return Decoration.none;
	},
	update(oldState: DecorationSet, transaction: Transaction){
		return transaction.effects.reduce((deco, effect) => {
			if (effect.is(decorationUpdateEffect)){
				return effect.value;
			}
			return deco;
		}, oldState);
	},
	provide: f => EditorView.decorations.from(f)
});
