# Water Jug Challenge 🏺

## Challenge Description 🧩

The Water Jugs Challenge is a classic problem in mathematical reasoning that requires strategic thinking and systematic planning. The puzzle is set up with two water jugs, each with distinct and unmarked capacities. The aim is to obtain an exact, predetermined amount of water in one of the jugs by using only a limited set of operations.

The allowed operations are straightforward but require careful manipulation to reach the goal::

- Fill a jug completely: pour water until the jug reaches its full capacity.
- Empty a jug entirely: discard all the water in the jug.
- Transfer water between the jugs: pour water from one jug to the other until the receiving jug is full or the pouring jug is empty.


No additional measuring tools are permitted; you rely solely on these operations to achieve the target volume. 

## API Description 💻

This REST API is intended to return a JSON containing a key value

```
{
	"solution": string | object // If there is no solution, it returns a string with the message "No solution possible". Otherwise, it returns an array with the steps to solve the challenge.
}
```

The array that returns data in case of solution, contains a JSON with the following values:

```
{
  "solution": [
    {
      "step": Integer, //number of steps in the game.
      "bucketX": Integer, //Amount of water in jug X.
      "bucketY": Integer, //Amount of water in jug Y.
      "action": String, //action that was done
      "status": String //Yes it was solved
    },
  ]
}
```

The REST API handles a single endpoint, this being a POST method to /solution

```http
  POST /solution
```

The endpoint receives the following payload in its body:

```
{ 
  "x_capacity":Integer,//jar capacity x
  "y_capacity":Integer,//jar capacity y
  "z_amount_wanted":Integer//Desired target capacity in jar z
} 
```

### Algorithm 📋

To ensure the correct operation of the algorithm, all values in the payload must meet specific conditions: each value must be a positive integer greater than zero. If any of the values are less than or equal to zero, or are not integers, an error message will be generated stating: 'All inputs must be positive integers.


#### findSolution = (X, Y, Z) =>

This approach involves solving the Water Jug Challenge using the Breadth-First Search (BFS) algorithm, which systematically explores each possible state of the jugs. By employing BFS, we can efficiently navigate through all potential moves to identify the shortest sequence of steps that leads to the desired water measurement

```JS
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
```

The findSolution method consists of 3 key elements

##### 1. Queue and Visited Set

Queue (```queue```): We use a queue to store the jug states in the format (```bucketX```, ```bucketY```), along with the sequence of steps that led to that state. Each state contains:

- ```bucketX```: Amount of water in jug X.
- ```bucketY```: Amount of water in jug Y.
- ```steps```: An array containing all the steps needed to reach this state.

- Purpose of the Queue: The queue is used to process each state in the order it was discovered, following a Breadth-First Search (BFS). This ensures the algorithm explores all possible states at one level (number of steps) before moving to the next, finding the solution in the minimum number of steps.

- Visited Set(```visited```): The visited set stores each combination of water quantities in the jugs as a unique string. This prevents the algorithm from reanalyzing the same state. For example, if we reach the state (5, 0) in an iteration, the visited set records it so that if the algorithm tries to analyze (5, 0) again in the future, it skips it and continues with other states.

##### 2. Stopping Condition

- Objective: The algorithm’s goal is to find a sequence of steps that leads to one of the jugs containing exactly ```Z``` gallons of water.

- Condition Check:: In each iteration of the loop, the algorithm checks if either ```bucketX``` or ```bucketY``` contains Z gallons.
If ```bucketX === Z``` or ```bucketY === Z```, it means we have reached the desired amount. In this case, the algorithm returns the list of steps with the necessary steps to reach this amount.

##### 3. Generating New States:

- Possible Actions: From each state (```bucketX```, ```bucketY```), the algorithm generates a list of possible actions:
1) Fill bucketX to its maximum capacity X.
2) Fill bucketY to its maximum capacity Y.
3) Completely empty bucketX.
4) Completely empty bucketY.
5) Transfer water from bucketX to bucketY until bucketX is empty or bucketY is full.
6) ransfer water from bucketY to bucketX until bucketY is empty or bucketX is full.

- Calculations:  For each action, the new water levels in both jugs (```newBucketX``` and ```newBucketY```) are calculated, ensuring they do not exceed their maximum capacities (```X``` and ```Y```).

- Adding New States to the Queue:  After calculating a new state, the algorithm checks if the state (```newBucketX```, ```newBucketY```) has already been visited. If it has not, the new state is added to the queue along with the updated sequence of steps. This allows the algorithm to explore this state in future iterations, following the order of discovery


## Getting Started 🚀

Now, in order to execute the REST API, it is necessary to follow the following steps:

### Prerequisites 📋

To set up and run the REST API on a local machine, please ensure the following prerequisites are met:

* Node.js [Node.js](https://nodejs.org/en/)
* For the project was used [Visual Studio Code](https://code.visualstudio.com/) as a development environment, but other options can be used.
