import {Hono} from 'hono'
import {query} from '@ifyour/deeplx'
import * as OpenCC from 'opencc-js';

const app = new Hono()

app
    .get('/', (c) => c.redirect('/translate'))
    .get('/translate', (c) => c.text('Please use POST method :)'))
    .post('/translate', async c => {
        const params = await c.req.json().catch(() => ({}))
        const result = await query(params, {proxyEndpoint: 'https://ideepl.vercel.app/jsonrpc'})
        if (result.code === 200 && result.target_lang === "ZH" && result.data) {
            const converter = OpenCC.Converter({from: 'cn', to: 'hk'})
            const data = result.data
            result.data = converter(data)
        }
        return c.json(result, result.code)
    })

export default app
