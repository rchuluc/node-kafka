async function delay(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = delay