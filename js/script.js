const editArea = document.querySelector('.edit-area');

editArea.setAttribute('contenteditable', 'true')

const classMapper = {
    'bold': 'bold-text',
    'italic': 'italic-text',
    'head-1': 'header1-text',
    'head-2': 'header2-text'
}

function getTagByClass(buttonClassName) {
    if (buttonClassName === 'head-1') {
        return 'h1';
    }

    if (buttonClassName === 'head-2') {
        return 'h2';
    }

    return 'span';
}

function removeDuplicate(rootNode, className) {
    const nestedNodesWithSameClass = rootNode.querySelectorAll(`.${className}`);
    nestedNodesWithSameClass.forEach(node => {
        if (node.className === className) {
            const parent = node.parentNode;
            node.childNodes.forEach(node => {
                parent.append(node);
            })
            node.remove();
        }
    })
}

function getHighlightSection() {
    const selection = document.getSelection();
    const range = selection.getRangeAt(0);

    return {
        selection,
        range
    }
}

function stylizeSelection(buttonClassName) {
    const {range} = getHighlightSection();
    const oldContents = range.extractContents();
    const newNode = document.createElement(getTagByClass(buttonClassName));
    newNode.setAttribute('class', classMapper[buttonClassName]);
    newNode.appendChild(oldContents);
    removeDuplicate(newNode, classMapper[buttonClassName])
    range.insertNode(newNode);
}

const APPLIED_STYLE_PROPERTY = [
    'font-family',
    'font-size',
    'line-height',
    'font-weight',
    'font-style',
    'display',
    'margin',
    'color'
];

function setInlineStyles() {
    const nodes = editArea.querySelectorAll('.bold-text, .italic-text, .header1-text, .header2-text');

    nodes.forEach(node => {
        const computedStyles = getComputedStyle(node);
        APPLIED_STYLE_PROPERTY.forEach(property => {
            const computedValue = computedStyles.getPropertyValue(property);
            node.style.setProperty(property, computedValue)
        })
    })

    editArea.normalize();

    setTimeout(() => {
        nodes.forEach(node => {
            APPLIED_STYLE_PROPERTY.forEach(property => {
                node.style.removeProperty(property)
            })
        })
    }, 0)
}

function getIsSelectionIntoEditArea() {
    const {selection} = getHighlightSection();

    return editArea.contains(selection.anchorNode) && editArea.contains(selection.focusNode);
}

document.addEventListener('copy', () => {
    setInlineStyles();
});

document.addEventListener('cut', () => {
    setInlineStyles();
});

document.addEventListener('click', (event) => {
    let target = event.target;

    if (target.parentNode.tagName === 'BUTTON') {
        target = target.parentNode;
    }

    if (target.tagName === 'BUTTON') {
        const className = target.getAttribute('class');

        if (getIsSelectionIntoEditArea()) {
            stylizeSelection(className);
            setInlineStyles();
        }
    }
})
