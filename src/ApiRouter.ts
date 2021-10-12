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
        this.router.get('/competitions', this.competitionRouter.bind(this));
    }

    private async competitorRouter(req: express.Request, res: express.Response): Promise<void> {
        const searchTerm = req.query.search ?? '';
        console.log("Searching competitors on '" + req.query.search + "'");
        try {
            const competitors = await this.dbPool.query("select competitor_id, competitor_name from bookkeeper.competitor where lower(competitor_name) like lower($1) || '%' limit 10", [searchTerm]);
            console.log(competitors);
            res.status(200).json(competitors.rows);
        }
        finally {
            console.log("something went wrong");
        }
    }

    private async competitionRouter(req: express.Request, res: express.Response): Promise<void> {
        const searchTerm = req.query.search ?? '';
        console.log("Searching competitions on '" + req.query.search + "'");
        try {
            const competitions = await this.dbPool.query("select competition_id, competition_name, competition_code from bookkeeper.competition where lower(competition_name) like lower($1) || '%' or lower(competition_code) like lower($1) limit 10", [searchTerm]);
            console.log(competitions);
            res.status(200).json(competitions.rows);
        }
        finally {
            console.log("something went wrong");
        }
    }
}

export { ApiRouter }