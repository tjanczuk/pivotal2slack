Auth0 Webtask.io Slack Webhook for Pivotaltracker
===

This project uses [Auth0 Webtasks](https://webtask.io) to send a notification to Slack as a result of a change in your [PivotalTracker](https://pivotaltracker.com) board. For example, if a comment is added to a Pivotaltracker story, this is what you will see in Slack: 

![image](https://cloud.githubusercontent.com/assets/822369/14529710/3b52f3d6-022c-11e6-8c22-6d0e6c45b40d.png)

## TL;DR;

```bash
npm install -g wt-cli
wt init
wt create https://raw.githubusercontent.com/tjanczuk/pivotal2slack/master/pivotal2slack.js \
  --capture --prod \
  --name pivotal2slack \
  --secret SLACK_TOKEN={your_slack_token} \
  --secret SLACK_CHANNEL={your_slack_channel_id} \
  --secret AUTH={random_key}
``` 

Take the resulting URL, append `auth={random_key}` URL query parameter, and install it as an Activity Webhook through settings in your Pivotaltracker project. The URL may look like this: 

```
https://webtask.it.auth0.com/api/run/wt-foobar/pivotal2slack?auth=abc123
```

## Gotchas

1. The `{your_slack_token}` is the slack token associated with a Slack bot you need to create. It typically looks like `xoxb-3455...f7GE`.  

2. You must explicitly invite and join the slack bot user to the channel you want to post to, otherwise authorization will fail. 

3. The `{your_slack_channe_id}` is the ID of the slack channel, not its name. It typially looks like `C0LATKSKA`. 

4. The `{random_key}` you specify when creating the webtask with `wt create` must be the same as the value of the `auth` URL query parameter you append to the generated webtask URL. Take care to URL encode special characters in the URL. 

## Testing

You can test the integration locally before installing it in Pivotaltracker: 

```bash
git clone https://github.com/tjanczuk/pivotal2slack.git
cd pivotal2slack
npm i
SLACK_TOKEN={your_slack_token} SLACK_CHANNEL={your_slack_channel_id} node pivotal2slack.js
```

If successful, this should post a simple test message to your Slack channel, othwerwise it will report an error. 

Enjoy!

