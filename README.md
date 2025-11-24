# Create incidents in PagerDuty with a reaction
![PagerDuty Badge](https://img.shields.io/badge/PagerDuty-Integration-blue?style=for-the-badge&logo=pagerduty&logoColor=white)
![PagerDuty Badge](https://img.shields.io/badge/Slack-Integration-blue?style=for-the-badge&&logo=slack&logoColor=white)

![PagerDuty](https://i.postimg.cc/NFwjkqx8/pagerlogo.png) 

***PagerDuty x Slack Integration***

A small Node.js + Slack Bolt application that creates PagerDuty incidents directly from Slack reactions and updates Slack messages based on PagerDuty webhook events.

***Features***

- Trigger PagerDuty incidents from Slack by reacting with a specific emoji

- Opens a Slack modal to collect incident details

- Creates incidents via PagerDuty REST API

- Stores message references using Redis

- Updates Slack messages on incident events (triggered, escalated, resolved)

---

```

                       .,,uod8B8bou,,.                             
              ..,uod8BBBBBBBBBBBBBBBBRPFT?l!i:.                    
         ,=m8BBBBBBBBBBBBBBBRPFT?!||||||||||||||                   
         !...:!TVBBBRPFT||||||||||!!^^""'   ||||                   
         !.......:!?|||||!!^^""'            ||||                   
         !.........||||                     ||||                   
         !.........||||      pager          ||||                   
         !.........||||                     ||||                   
         !.........||||                     ||||                   
         !.........||||           duty      ||||                   
         !.........||||                     ||||                   
         `.........||||                    ,||||                   
          .;.......||||               _.-!!|||||                   
   .,uodWBBBBb.....||||       _.-!!|||||||||!:'                    
!YBBBBBBBBBBBBBBb..!|||:..-!!|||||||!iof68BBBBBb....               
!..YBBBBBBBBBBBBBBb!!||||||||!iof68BBBBBBRPFT?!::   `.             
!....YBBBBBBBBBBBBBBbaaitf68BBBBBBRPFT?!:::::::::     `.           
!......YBBBBBBBBBBBBBBBBBBBRPFT?!::::::;:!^"`;:::       `.         
!........YBBBBBBBBBBRPFT?!::::::::::^''...::::::;         iBBbo.   
`..........YBRPFT?!::::::::::::::::::::::::;iof68bo.      WBBBBbo. 
  `..........:::::::::::::::::::::::;iof688888888888b.     `YBBBP^'
    `........::::::::::::::::;iof688888888888888888888b.     `     
      `......:::::::::;iof688888888888888888888888888888b.         
        `....:::;iof688888888888888888888888888888888899fT!        
          `..::!8888888888888888888888888888888899fT|!^"'          
            `' !!988888888888888888888888899fT|!^"'                
                `!!8888888888888888899fT|!^"'                      
                  `!988888888899fT|!^"'                            
                    `!9899fT|!^"'                                  

```