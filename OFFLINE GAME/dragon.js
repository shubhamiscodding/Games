
const dragonImg = document.querySelector('.dragonimg');


   
    document.addEventListener('keydown', () => {
        dragonImg.classList.add('active');
        const dragonHeight = getComputedStyle(dragon).height;
    });

    setTimeout(() => {
        dragonImg.classList.remove('active');
    }, 300);

    const dragon = document.querySelector('.dragon img');
    const field = document.querySelector('.feild img'); 
    const container = document.querySelector('.constainer'); 
    
    if (dragon && field && container) {
      
        const checkCollision = () => {
            const dragonRect = dragon.getBoundingClientRect();
            const fieldRect = field.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
    
           
            if (
                fieldRect.right > containerRect.left &&
                fieldRect.left < containerRect.right &&
                fieldRect.bottom > containerRect.top &&
                fieldRect.top < containerRect.bottom
            ) {
                
                if (
                    dragonRect.right > fieldRect.left &&
                    dragonRect.left < fieldRect.right &&
                    dragonRect.bottom > fieldRect.top &&
                    dragonRect.top < fieldRect.bottom
                ) {
                    alert("Game Over");
                    return; 
                }
            }
    
           
            requestAnimationFrame(checkCollision);
        };
    
       
        checkCollision();
    }