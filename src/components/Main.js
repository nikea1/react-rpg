import { useEffect, useState } from "react";
import { Character } from "./Character";

function Char(Cname, Cimg, Chp, Catk, Ccounter, Cinc ){
    this.name = Cname;
    this.img = Cimg;
    this.hp = Chp;
    this.atk = Catk;
    this.counter = Ccounter;
    this.inc = Cinc;
}

let players = [];
// Name, Pic, HP, Atk, counter, increment
players[0] = new Char("Ina'nis Ninomae ", "https://static.miraheze.org/hololivewiki/thumb/b/ba/Ninomae_Ina%27nis_-_Main_Page_Icon.png/192px-Ninomae_Ina%27nis_-_Main_Page_Icon.png", 150, 5, 7, 5)
players[1] = new Char("Calliope Mori", "https://static.miraheze.org/hololivewiki/thumb/f/f3/Mori_Calliope_-_Main_Page_Icon.png/192px-Mori_Calliope_-_Main_Page_Icon.png", 160, 4, 8, 4)
players[2] = new Char("Gura Gwar", "https://static.miraheze.org/hololivewiki/thumb/1/15/Gawr_Gura_-_Main_Page_Icon.png/192px-Gawr_Gura_-_Main_Page_Icon.png", 170, 7, 9, 7)
players[3] = new Char("Kiara Takanashi", "https://static.miraheze.org/hololivewiki/thumb/3/3e/Takanashi_Kiara_-_Main_Page_Icon.png/192px-Takanashi_Kiara_-_Main_Page_Icon.png", 130, 9, 10, 9)
players[4] = new Char("Amelia Watson","https://static.miraheze.org/hololivewiki/thumb/4/49/Watson_Amelia_-_Main_Page_Icon.png/192px-Watson_Amelia_-_Main_Page_Icon.png", 110, 6, 8, 6)


function statusFunc(payload){
        
    if(payload.player.hp > 0 && payload.enemy.hp > 0){
        //Combat Status
        return <>
                <div>{`${payload.player.name} does ${payload.player.atk} damage to ${payload.enemy.name}!`}</div>
                <div>{`${payload.enemy.name} counters ${payload.player.name} for ${payload.enemy.counter} damage!`}</div>
                </>
        
    }
    //enemy died
    if(payload.enemy.hp <= 0){

        //more fighters in the wait list
        if(payload.waitList.length > 0){
            return <div>{`You defeated the enemy. Select the next fighter.`}</div>
        }
        
        //all fighters defeated
        if (payload.waitList.length <= 0){
            return <div>{`You defeated everyone! You win!`}</div>
        }      
    }

    //Player died
    if(payload.player.hp <= 0){
        return <div>{`You were defeated! Game over!`}</div>
    }  
}

//create a waitlist
function initWaitlist(chars, waitList = players){

    let w = []
    for (let i = 0 ; i <  waitList.length; i++){
        if(waitList[i] !== chars.player){
            if(waitList[i] !== chars.enemy)
                w.push(waitList[i])
        }
    }
    return w;
}

export function Main(){
    const [rpgState, setRPGState] = useState('playerSelect')
    const [charRole, setCharRole] = useState({player: {}, waitList: [], enemy: {}})
    const [statusDisplay, setStatusDisplay] = useState(false)
    
    //on button press the fight happens
    function playerBattle(){

        //if player or enemy is already dead don't battle
        if(charRole.player.hp <= 0 || charRole.enemy.hp <= 0) return;
        
        setStatusDisplay(true) //Quick and dirty 

        //calculate battle
        let enemyHp = charRole.enemy.hp - charRole.player.atk
        let lvlUp = charRole.player.atk + charRole.player.inc;
        let playerHp = charRole.player.hp
        
        //enemy counter attacks if still alive  
        if(enemyHp > 0){
            playerHp -= charRole.enemy.counter
    
            if(playerHp <= 0) setRPGState('gameOver')
        }

        //if enemy is dead check for other fighters
        else if(enemyHp <= 0){
            //if there are fighters pick a new one else end the game
            (charRole.waitList.length > 0) ? setRPGState('enemySelect') : setRPGState('gameOver')  
        }

        //update state
        setCharRole((prevState) => {
            
            return {...prevState, 
                player: {...prevState.player, atk:lvlUp, hp: playerHp},
                enemy: {...prevState.enemy, hp: enemyHp}
            }
        })
    }

    //reset the game state
    function resetOnClick(){
        setStatusDisplay(false);
        setRPGState('playerSelect');
        setCharRole({player: {}, waitList: [], enemy: {}})
    }

    //update on rpg state change
    useEffect(() => {
        //sets waitlist on rpgState change
        if(rpgState !== 'playerSelect' && rpgState !== 'gameOver'){
            
            //update waitlist state
            setCharRole((prevState) => {
                let w;
                if(prevState.waitList.length === 0 ){
                    
                    w = initWaitlist(prevState);
                } 
                else{
                    w = initWaitlist(prevState, prevState.waitList)
                }
                return {...prevState, waitList: w}
            })
        }
        //clear status screen when state changes to battle
        if (rpgState === 'battle'){
            setStatusDisplay(false)
        }
  
    },[rpgState]) 

    
    return (
    <main>
        <div className="wrapper">
            {rpgState==="playerSelect" && <div className="playerSelectContainer">
                <h2>Choose your Character</h2>
                <div id="playerSelect">
                    {players.map((c, i) => <div key={i}><Character role={'init'} rpgState={rpgState} setRPGState={setRPGState} setCharRole={setCharRole} charData={c}/></div> )}
                </div>
            </div>}

            {Object.keys(charRole.player).length > 0 && charRole.player.hp > 0 && <div className="playerAreaContainer">
            <h2>Player</h2>
            <div id="playerArea">
                {<Character role={'player'} rpgState={rpgState} setRPGState={setRPGState} setCharRole={setCharRole} charData={charRole.player}/>}
            </div>
            </div>}

            {rpgState === "enemySelect" && <div className="waitAreaContainer">
                <h2>Choose Your Opponent</h2>
                <div id="waitingArea">
                    {charRole.waitList.length > 0 && charRole.waitList.map((c,i) => <div key={i}><Character role={'wait'} rpgState={rpgState} setRPGState={setRPGState} setCharRole={setCharRole} charData={c}/></div>)}
                </div>
            </div>}
            
            {Object.keys(charRole.enemy).length > 0 && charRole.enemy.hp > 0 && <>
                <button onClick={playerBattle} type="button">Attack</button>
                <h2>Defender</h2>
                <div id="enemyArea">
                    {<Character role={'enemy'} rpgState={rpgState} setRPGState={setRPGState} setCharRole={setCharRole} charData={charRole.enemy}/>}
                </div>
            </>
            }
            <div id="status">
                {statusDisplay && statusFunc(charRole)} 
                {rpgState==='gameOver' && <button onClick={resetOnClick} type="button">Reset</button>}
            </div>
        </div>
    </main>
    )
}

