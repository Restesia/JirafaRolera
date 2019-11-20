const Discord = require('discord.js');
const client = new Discord.Client() ;
const numMaxPrioridad = 14 ;

Roleros = new Map() ;
Partidas = new Map() ;
historialPartidas = new Map(); 


client.on('ready', () => {
    console.log('My bot is : ready') ;
}) ;

client.on('message', msg => {
    if(msg.content.includes('!Participar')){

      if(!Roleros.has(msg.author.username)){

        Roleros.set(msg.author.username,0) ;

      }
      // Busca la siguiente palabar acontinuación del comando
      index = msg.content.indexOf('!Participar') ;
      init = index+12 ;
      char = msg.content.charAt[index+12] ;

      while(char != ' ' && msg.content.length > index+12){

        //console.log('Computando la palabra siguiente al comando') ;
        index++ ;
        char = msg.content.charAt[index+12] ;
        
      }
      name = msg.content.substr(init, index+11) ;

      //console.log(name) ; // esta es la palabra

      // comprueba si existe una partida con ese nombre 
      if(Partidas.has(name)){

        mapaPartida = Partidas.get(name) ;
        if(!historialPartidas.get(name)[0]===msg.author.username){
          // comprueba si ya hay alguien registrado con esa prioridad
          if(mapaPartida.has(Roleros.get(msg.author.username))){

            mapaPartida.set(Roleros.get(msg.author.username), mapaPartida.get(Roleros.get(msg.author.username)).push(msg.author.username)) ;

          }else{
            // en caso de que no haya nadie crea el array y lo añade con la prioridad
            mapaPartida.set(Roleros.get(msg.author.username), [msg.author.username]) ;
            
            
          }
          msg.reply( ' ha sido añadido a la lista para la partida ' + name + ' con prioridad ' + Roleros.get(msg.author.username).toString()) ;
        }else{

          msg.reply(' esa es tu partida compañero, no puedes participar en ella') ;

        }


        // aumenta la prioridad
        Roleros.set(msg.author.username, Roleros.get(msg.author.username) + 1) ;

      }else{
        msg.reply(' lo siento pero esa partida no existe') ;
      }

    }

    if(msg.content.includes('!Cancelar')){

      // Computa la cadena posterior al comando
      index = msg.content.indexOf('!Cancelar') ;
      init = index+10 ;
      char = msg.content.charAt[index+10] ;

      while(char != ' ' && msg.content.length > index+10){

          //console.log('Computando la palabra siguiente al comando') ;

          index++ ;
          char = msg.content.charAt[index+10] ;

      }

      name = msg.content.substr(init, index+9) ;
      // comprueba si existe esa partida
      if(Partidas.has(name)){

        mapaPartida = Partidas.get(name) ;

        // comprueba si existe alguien con su prioridad en la lista, para que el programa no pete en el siguiente if
        if(mapaPartida.has(Roleros.get(msg.author.username)-1)){

          // comprueba si la persona esta en esa partida
          if(mapaPartida.get(Roleros.get(msg.author.username)-1).includes(msg.author.username)){
            
            // elimina a la persona en caso de que esté y le reduce la prioridad
            mapaPartida.get(Roleros.get(msg.author.username)-1).splice(mapaPartida.get(Roleros.get(msg.author.username)-1).indexOf(msg.author.username)) ;
            Roleros.set(msg.author.username, Roleros.get(msg.author.username) -1) ;
            msg.channel.send(msg.author.username + ' Te hemos eliminado de la partida ' + name + ' tu prioridad vuelve a ser de ' + Roleros.get(msg.author.username).toString()) ;

          }else{

            msg.reply(' pero si tu no estas en esa partida') ;

          }
        }else{

          msg.reply(' No existe nadie con esa prioridad en la partida, no puedes estar apuntados') ;

        }

      }else{

        msg.reply('Lo siento pero esa partida no existe') ;
        
      }


    }

    if(msg.content.includes('!AbrirPartida')){
      
      // computa el termino a la derecha del comando en el mensaje 
      index = msg.content.indexOf('!AbrirPartida') ;
      init = index+14 ;
      char = msg.content.charAt[index+14] ;
      while(char != ' ' && msg.content.length > index+14){

          //console.log('Computando la palabra siguiente al comando') ;

          index++ ;
          char = msg.content.charAt[index+14] ;
      }
      name = msg.content.substr(init, index+13) ;
      
      // comprueba si existe una partida en ese nombre creada anteriormente
      if(!Partidas.has(name)){

        Partidas.set(name, new Map()) ;
        historialPartidas.set(name, [msg.author.username,true]) ; 
        msg.reply(' Tu partida se ha creado correctamente, los jugadores ya se pueden apuntar') ;
        msg.channel.send( 'Se habre la partida de ' + msg.author.username + ', no hace falta correr chicos' ) ;

      }else{

        msg.reply(' esa partida ya existe, porfavor escoja otro nombre.') ;

      }

    }

    if(msg.content.includes('!CerrarPartida')){

      //Computa el termino a la derecha del comando
      index = msg.content.indexOf('!CerrarPartida') ;
      init = index+15 ;
      char = msg.content.charAt[index+15] ;
      while(char != ' ' && msg.content.length > index+15){

          //console.log('Computando la palabra siguiente al comando') ;

          index++ ;
          char = msg.content.charAt[index+15] ;
      }
      name = msg.content.substr(init, index+14) ;
      
      if(Partidas.has(name)){

        if(historialPartidas.get(name)[1]){

          historialPartidas.set(name, false) ;
          Posibles_jugadores = Partidas.get(name) ;
          msg.reply(' la lista de prioridad aleatoria para tu partida es la siguiente: ')
          for(i = 0; i < numMaxPrioridad ; i++){
            if(Posibles_jugadores.has(i)){

              j = Posibles_jugadores.get(i) ;

              while(j.length !=0){

                random = Math.trunc(Math.random() * j.length) ;

                console.log(random) ;                
                console.log(j) ;                
                console.log(Posibles_jugadores) ;
                console.log(j[random]) ;
                msg.channel.send(j[random]) ;
                j.splice(random) ;

              }
              
            }
          }
          Partidas.delete(name) ;
          historialPartidas.set(name, [historialPartidas.get(name)[0], false]) ;

        }else{

          msg.reply(' esta partida ya ha sido cerrada') ;

        }
      }else {

        msg.reply(' esta partida no existe') ;

      }


    }

    console.log(msg.content) ;
  });

token = 'NjQ2MDAwNjAyNDUwNDkzNDQx.XdKxGQ.1CzRZ1JelDAJ1q4sKpZGY9M-uZA' ;
client.login(token) ;