
/*--------------------------------------------------------------
# findSolution: Now To solve the water vase problem, we use an algorithm based 
on "Breadth First Search" (BFS), which will explore the possible actions
--------------------------------------------------------------*/

export const findSolution = (X, Y, Z) => {
    // Initialize the queue to keep track of states, each with bucket levels and steps taken
    const queue = [];
    
    // Create a set to track visited states and avoid revisiting them
    const visited = new Set();
    
    // Start with both buckets empty and no steps taken, then add to the queue
    queue.push({ bucketX: 0, bucketY: 0, steps: [] });

    // Process each state in the queue until we find a solution or run out of states
    while (queue.length > 0) {
        // Dequeue the first state in the queue
        const { bucketX, bucketY, steps } = queue.shift();

        // Check if the current state meets the target goal in either bucket
        if (bucketX === Z || bucketY === Z) {
            // Make a copy of the current steps to avoid modifying the original array
            const solvedSteps = [...steps];
            
            // Mark the last action as "Solved" to indicate the solution has been found
            solvedSteps[solvedSteps.length - 1].status = "Solved";
            
            // Return the steps to reach the solution
            return solvedSteps;
        }

        // If this state has already been visited, skip it
        if (visited.has(`${bucketX}-${bucketY}`)) {
            continue;
        }
        
        // Mark the current state as visited by adding it to the visited set
        visited.add(`${bucketX}-${bucketY}`);

        // Define possible actions from the current state (filling, emptying, and transferring water)
        const newStates = [
            { newBucketX: X, newBucketY: bucketY, action: "Fill bucket X" }, // Fill bucket X to its capacity
            { newBucketX: bucketX, newBucketY: Y, action: "Fill bucket Y" }, // Fill bucket Y to its capacity
            { newBucketX: 0, newBucketY: bucketY, action: "Empty bucket X" }, // Empty all water from bucket X
            { newBucketX: bucketX, newBucketY: 0, action: "Empty bucket Y" }, // Empty all water from bucket Y
            {
                newBucketX: Math.max(0, bucketX - (Y - bucketY)),  // Transfer from bucket X to Y
                newBucketY: Math.min(Y, bucketX + bucketY),
                action: "Transfer from bucket X to Y"
            },
            {
                newBucketX: Math.min(X, bucketX + bucketY),  // Transfer from bucket Y to X
                newBucketY: Math.max(0, bucketY - (X - bucketX)),
                action: "Transfer from bucket Y to X"
            }
        ];

        // Loop over all new possible states created from the current state
        for (const { newBucketX, newBucketY, action } of newStates) {
            // If the new state has not been visited yet
            if (!visited.has(`${newBucketX}-${newBucketY}`)) {
                // Add the new state to the queue with the updated steps array
                queue.push({
                    bucketX: newBucketX,
                    bucketY: newBucketY,
                    steps: steps.concat([{ step: steps.length + 1, bucketX: newBucketX, bucketY: newBucketY, action }])
                });
            }
        }
    }
    
    // If no solution is found after exploring all states, return an empty array
    return [];
}



export const getSolution = (req,res) =>{

    const { x_capacity, y_capacity, z_amount_wanted } = req.body;
    
    //If to ensure that there are no negative numbers or any other type that is not an integer

    if (!Number.isInteger(x_capacity) || !Number.isInteger(y_capacity) || !Number.isInteger(z_amount_wanted) ||
        x_capacity <= 0 || y_capacity <= 0 || z_amount_wanted <= 0) {
        return res.status(400).json({ error: 'All inputs must be positive integers' });
    }

    //If z is greater than jars x or y, they will never reach the target

    if(z_amount_wanted > x_capacity && z_amount_wanted > y_capacity){
        return res.json({ solution: 'No solution possible' });
    }

    //Here we will get the solution by invoking our FindSolution function
    
    const solution = findSolution(x_capacity, y_capacity, z_amount_wanted);

    if (solution.length === 0) {
        return res.json({ solution: 'No solution possible' });
    }

    res.json({ solution });
}