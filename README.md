## Criação de incidentes Pager duty

> em desenvolvimento... Andando bem… no desespero, mas andando
```
├── src
│   ├── appPagerDuty
│   │   └── createIncident
│   │       └── createIncident.ts
│   ├── appSlack
│   │   ├── Notifies
│   │   │   └── slackNotifier.ts
│   │   ├── actions
│   │   │   └── actions.ts
│   │   ├── events
│   │   │   └── reaction.ts
│   │   ├── homeTab
│   │   │   └── home.ts
│   │   ├── modalSlack
│   │   │   └── modal.ts
│   │   └── storage
│   │       ├── messageStorage.ts
│   │       └── redis.ts
│   ├── image
│   │   └── pagerduty-seeklogo.png
│   ├── app.ts
│   └── server.ts
├── .gitignore
├── LICENSE
├── README.md
├── package-lock.json
├── package.json
└── tsconfig.json
```


                                _,.-------.,_                                 
                            ,;~'             '~;,                             
                          ,;                     ;,                           
                         ;                         ;                          
                        ,'                         ',                         
                       ,;                           ;,                        
                       ; ;      .           .      ; ;                        
                       | ;   ______       ______   ; |                        
                       |  `/~"     ~" . "~     "~\'  |                        
                       |  ~  ,-~~~^~, | ,~^~~~-,  ~  |                        
                        |   |        }:{        |   |                         
                        |   l       / | \       !   |                         
                        .~  (__,.--" .^. "--.,__)  ~.                         
                        |     ---;' / | \ `;---     |                         
                         \__.       \/^\/       .__/                          
                          V| \                 / |V                           
       __                  | |T~\___!___!___/~T| |                  _____     
    .-~  ~"-.              | |`IIII_I_I_I_IIII'| |               .-~     "-.  
   /         \             |  \,III I I I III,/  |              /           Y 
  Y          ;              \   `~~~~~~~~~~'    /               i           | 
  `.   _     `._              \   .       .   /               __)         .'  
    )=~         `-.._           \.    ^    ./           _..-'~         ~"<_   
 .-~                 ~`-.._       ^~~~^~~~^       _..-'~                   ~. 
/                          ~`-.._           _..-'~                           Y
{        .~"-._                  ~`-.._ .-'~                  _..-~;         ;
 `._   _,'     ~`-.._                  ~`-.._           _..-'~     `._    _.- 
    ~~"              ~`-.._                  ~`-.._ .-'~              ~~"~    
  .----.            _..-'  ~`-.._                  ~`-.._          .-~~~~-.   
 /      `.    _..-'~             ~`-.._                  ~`-.._   (        ". 
Y        `=--~                  _..-'  ~`-.._                  ~`-'         | 
|                         _..-'~             ~`-.._                         ; 
`._                 _..-'~                         ~`-.._            -._ _.'  
   "-.="      _..-'~                                     ~`-.._        ~`.    
    /        `.                                                ;          Y   
   Y           Y                                              Y           |   
   |           ;                                              `.          /   
   `.       _.'                                                 "-.____.-'    
     ~-----"                                                                 