import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "preact/hooks";
import PropTypes from "prop-types";

const GITHUB_OAUTH_CLIENT_ID = 'd8241998e22737bf5d90';
const DEVICE_CODE_GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:device_code';
const GITHUB_USER_VERIFICATION_URI = 'https://github.com/login/device';

const TokenControls = ({ accessToken, setAccessToken }) => {
    const [tokenField, setTokenField] = useState('');
    const inputToken = () => setAccessToken(tokenField);
    const resetToken = () => {
        setTokenField('');
        setAccessToken('');
    };
    return <>
        <Button onClick={!accessToken ? inputToken : resetToken}>
            {!accessToken ? <LoginIcon /> : <LogoutIcon />}
        </Button>
        <TextField
            size="small"
            margin="none"
            variant="outlined"
            label="gist access token"
            onChange={(event) => setTokenField(event.target.value)}
            value={tokenField}
            inputProps={{ readOnly: !!accessToken }}
        />
    </>;
}

const GistControls = ({ accessToken, clearAccessToken, nodeState, enabled = true }) => {
    const serializeNodeState = (nodeState) => {
        const body = {
            "files": {
                "perusal_state.json": {
                    "content": JSON.stringify(nodeState, null, '\t')
                }
            },
            "public": false
        };
        return JSON.stringify(body, null, '\t');
    };
    const createGist = async (state) => {
        return fetch('https://api.github.com/gists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: serializeNodeState(nodeState)
        })
            .then(async (res) => {
                const responseJson = await res.json().then((fullResponse) => ({
                    public: fullResponse.public,
                    url: fullResponse.url,
                    gist_id: fullResponse.id,
                    ownerGistsUrl: fullResponse.owner.gists_url
                }));
                alert(`Save succeeded! Got response:\n${JSON.stringify(responseJson, null, '\t')}`);
            })
            .catch(err => {
                clearAccessToken();
                alert(err);
            });
    };
    return <>
        <Button disabled={!enabled} onClick={() => createGist(nodeState)}>
            <Typography variant="button">
                Save gist
            </Typography>
        </Button>
        <Button disabled={!enabled}>
            <Typography variant="button">
                Load gist
            </Typography>
        </Button>
    </>;
}

const GistStorage = ({ nodeState, setNode }) => {
    const [accessToken, setAccessToken] = useState('');
    return <Box >
        <TokenControls accessToken={accessToken} setAccessToken={setAccessToken} />
        <GistControls
            accessToken={accessToken}
            clearAccessToken={() => setAccessToken('')}
            nodeState={nodeState}
            enabled={!!accessToken}
        />
    </Box>;
}

GistStorage.propTypes = {
    nodeState: PropTypes.oneOfType([
        PropTypes.shape(),
        PropTypes.array,
        PropTypes.string,
    ]).isRequired,
    setNode: PropTypes.func.isRequired,
}

export default GistStorage;