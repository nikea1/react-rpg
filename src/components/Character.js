//Init: Player select function, initalizing state, change to enemy select state
//Player: No function, battle state
//Enemy: No function, battle state
//Wait: Enemy Select, enemy select state, change to battle
export function Character({role ,rpgState, charData, setRPGState, setCharRole}){

    //Make onClick funct 
    function setCharaters(){
        if(rpgState !== 'battle'){
            //set player
            if(role==='init'){
                setCharRole((prevState) => {
                    return {...prevState, player: charData}
                })
                setRPGState(() => {
                    return 'enemySelect'
                })
            }
            //set enemy
            else if (role === 'wait'){
                setCharRole((prevState) => {
                    return {...prevState, enemy: charData}
                })
                setRPGState(() => {
                    return 'battle'
                })
            } 
        }   
    }

    return (
        <div className={"char-card "+ role} onClick={setCharaters}>
            <div  className="char-name">{charData.name}</div>
            <div className="char-pic"><img src={charData.img} alt=""/></div>
            <div className="char-hp" >{charData.hp}</div>
        </div>
    )
}