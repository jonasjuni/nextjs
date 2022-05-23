import {NextApiRequest, NextApiResponse} from 'next';
import jwtDecode from 'jwt-decode';

function Logout(req: NextApiRequest, res: NextApiResponse) {

    const idToken = req.query.id_token_hint as string;
    const keycloakIssuer: { iss: string } = jwtDecode(idToken);

    const path = keycloakIssuer.iss +
        '/protocol/openid-connect/logout?post_logout_redirect_uri=' +
        encodeURIComponent('http://localhost:3000/') +
        '&id_token_hint=' +
        encodeURIComponent(idToken);

    res.redirect(path);
}

export default Logout;