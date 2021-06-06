import express, { Request, Response } from 'express';

export function errorHandler(req: Request, res: Response) {
    res.status(404).sendFile('src/web/404.html', { root: '.' });
}