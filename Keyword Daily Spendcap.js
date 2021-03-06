// Caps spend of a specific keyword at a specific amount, pausing it when it reaches that point. Re-enables keyword once the new day starts. Must be ran hourly, and implemented at account level
function main() {
    

    var spendCap = 1000; // Enter spend cap for the day in the account currency
    var recipient = "email@email.com"; // Enter recipient to be notified on pausing
    var campaignName = "campaign name";
    var keywordName = "keyword";

    // Select campaigns under the client account
    var campaignIterator = AdWordsApp.campaigns().get();
    while(campaignIterator.hasNext()) {
        var campaign = campaignIterator.next();
        if (campaign.getName() == campaignName) {
            Logger.log(campaign.getName());
            var stats = campaign.getStatsFor("TODAY");
            Logger.log(stats.getCost());
        
        // Iterate through keywords in selected campaign
            var keywordSelector = campaign.keywords().forDateRange("TODAY");
            var keywordIterator = keywordSelector.get();
            while (keywordIterator.hasNext()) {
                var keyword = keywordIterator.next();
                
                // If the keyword is the target, then check stats for today, if enabled and spend is more than the cap then pause, if paused and spend is less than the cap then enable
                if (keyword.getText() == keywordName) {
                    Logger.log(keyword.getText());
                    var kwstats = campaign.getStatsFor("TODAY");
                    Logger.log(kwstats.getCost());
                    if (kwstats.getCost() > spendCap && keyword.isEnabled()) {
                        Logger.log("Pausing " + keyword.getText());
                        keyword.pause();
                        MailApp.sendEmail(recipient, `Paused ${keywordName}`, `Paused ${keywordName} at ${kwstats.getCost()}`);
                        break;
                    }
                    if (kwstats.getCost() < spendCap && keyword.isPaused()) {
                        Logger.log("Enabling " + keyword.getText());
                        keyword.enable();
                        MailApp.sendEmail(recipient, `Enabled ${keywordName}`, "Renabled kw due to spend below cap and kw paused");
                        break;
                    }
                    break;
                }
            }
            break;
        }
    }
}
