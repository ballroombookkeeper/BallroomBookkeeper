import express from 'express';
import { Pool } from 'pg';

class ApiRouter {

    public router: express.IRouter;
    private dbPool: Pool;

    constructor(dbPool: Pool) {
        this.router = express.Router();
        this.dbPool = dbPool;
        this.router.get('/test', (req, res) => { res.send('testing'); });
        this.router.get('/competitors', this.competitorRouter.bind(this));
    }

    private async competitorRouter(req: express.Request, res: express.Response): Promise<void> {
        const searchTerm = req.query.search ?? '';
        console.log("Searching on '" + req.query.search + "'");
        console.log("connected");
        try {
            const competitors = await this.dbPool.query("select competitor_id, competitor_name from bookkeeper.competitor where LOWER(competitor_name) like LOWER($1) || '%' limit 10", [searchTerm]);
            console.log(competitors);
            res.status(200).json(competitors.rows);
        }
        finally {
            console.log("something went wrong");
        }
    }
}

export { ApiRouter }