const https = require("https")

const allFields = [
    "offset",
    "currently",
    "minutely",
    "hourly",
    "daily",
    "alerts",
    "flags"
]

/**
 * Calculate the difference between two arrays
 *
 * All elements that appear in `a` and not in `b` are returned
 * @param {any[]} a
 * @param {any[]} b
 */
const diff = (a, b) => a.filter(v => b.indexOf(v) === -1)

/**
 * Perform a get request only accepting JSON and returning parsed JSON data
 * @param {{}} options standard `https.request` options
 * @return {Promise<{}>}
 */
const getJSON = options => new Promise((resolve, reject) =>
{
    https.get(Object.assign({}, options, { headers: { Accept: "application/json" } }), res =>
    {
        const data = []

        res
        .on("data", chunk => data.push(chunk))
        .once("end", () => resolve(JSON.parse(Buffer.concat(data).toString("utf8"))))
    })
    .once("error", reject)
    .end()
})

/**
 * Get the forcast on DarkSky
 * @param {string} key DarkSky API key
 * @param {[number, number]} location
 * @param {{time: number, lang: string, units: string, exclude: string[], include: string[]}} options
 */
const forecast = async (key, [ latitude, longitude ], { time, lang, units, exclude, include } = {}) =>
{
    if(include) {
        exclude = diff(allFields, include)
    }

    return await getJSON({
        host: "api.darksky.net",
        path: `/forecast/${key}/${latitude},${longitude}`
        + (time ? "," + time : "")
        + `?lang=${lang || "en"}&units=${units || "si"}`
        + (exclude ? "&exclude=" + exclude.join(",") : "")
    })
}


module.exports = forecast
