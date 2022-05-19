import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async (req: NextApiRequest, res: NextApiResponse) => {

    const idToken = req.query.id_token_hint as string;

    const path = `http://localhost:8080/realms/jcsj/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent('http://localhost:3000/')}&id_token_hint=${encodeURIComponent(idToken)}`;

    res.redirect(path);
};
