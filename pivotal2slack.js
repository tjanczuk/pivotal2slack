var request = require('superagent');

module.exports = function (ctx, cb) {
    for (var i in { SLACK_TOKEN: 1, SLACK_CHANNEL: 1, AUTH: 1 }) {
        if (typeof ctx.secrets[i] !== 'string')
            return cb(new Error('Did you forget to specify ' + i + ' secret when creating this webtask?'));
    }

    if (ctx.query.auth !== ctx.secrets.AUTH)
        return cb(new Error('Not authorized'));

    var message = [
        '<' + ctx.body.primary_resources[0].url + '|' + ctx.body.primary_resources[0].name + '>:\n',
        ctx.body.message
    ];

    request
        .post('https://slack.com/api/chat.postMessage')
        .type('form')
        .send({
            token: ctx.secrets.SLACK_TOKEN,
            channel: ctx.secrets.SLACK_CHANNEL,
            as_user: true,
            text: message.join(' ')
        })
        .timeout(10000)
        .end(function (error, res) {
            if (error) return cb(error);
            if (!res.ok || !res.body.ok) return cb(new Error('Invalid response from Slack: ' + res.status + ': ' + res.text));
            return cb();
        });
};

if (require.main === module) {
    require('dotenv').load();
    module.exports({
        query: {
            auth: 'abc'
        },
        secrets: {
            AUTH: 'abc',
            SLACK_TOKEN: process.env.SLACK_TOKEN,
            SLACK_CHANNEL: process.env.SLACK_CHANNEL
        },
        body: {
            message: 'This is a test',
            primary_resources: [
                {
                    url: 'https://webtask.io',
                    name: 'Pivotal2Slack integration via webtask.io'
                }
            ]
        }
    }, function (e) {
        if (e) throw e;
        console.log('Success');
    });
}
