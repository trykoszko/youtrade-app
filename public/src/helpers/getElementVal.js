const getElementVal = (elements, key) => Array.from(elements).filter(el => el.id === key).shift().value

export default getElementVal
