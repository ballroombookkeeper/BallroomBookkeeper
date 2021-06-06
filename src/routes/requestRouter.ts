import express, { Request, Response } from 'express';
import fs, { promises as fspromises } from 'fs';

const router = express.Router();
router.get('/', indexRouter);
router.get('/assets/:file', assetRouter);
router.get('/competitors', competitorListRouter);
router.get('/competitor/:id', competitorDetailsRouter);

function indexRouter(req: Request, res: Response, next: () => void) {
    const filename = 'src/web/index.html';
    fspromises.stat(filename)
        .then(() => res.sendFile(filename, { root: '.' }))
        .catch(() => {
            console.log(`no such file ${filename}`);
            next();
        });
}

function assetRouter(req: Request, res: Response, next: () => void) {
    let file: string = req.params.file;
    switch (file) {
        case 'style.css':
        case 'test.txt':
            file = `src/web/${file}`;
            break;
        default:
            console.log(`unallowable file ${file}`);
            next();
            return;
    }

    fspromises.stat(file)
        .then(() => res.sendFile(file, { root: '.' }))
        .catch((reason) => {
            console.error(reason);
            console.log(`no such file ${file}`);
            next();
        });
}

function competitorListRouter(req: Request, res: Response) {
    console.log('competitor list router');
    res.send('Ballroom Bookkeeper Competitor');
}

function competitorDetailsRouter(req: Request, res: Response) {
    console.log(`competitor details router: ${req.params.id}`);
    res.send(`Ballroom Bookkeeper Competitor Details: ${req.params.id}`);
}

export { router as RequestRouter };