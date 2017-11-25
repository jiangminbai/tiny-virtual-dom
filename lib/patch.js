const REMOVE = 0;
const INSERT = 1;
const ORDER = 2;
const PROPS = 3;
const TEXT = 4;

function patch() {

}

function applyPatch(domNode, vpatch) {
  const type = vpatch.type;
  
}

patch.REMOVE = REMOVE;
patch.INSERT = INSERT;
patch.ORDER = ORDER;
patch.PROPS = PROPS;
patch.TEXT = TEXT;

export default patch;