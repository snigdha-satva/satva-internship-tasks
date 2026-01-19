// A label is simply an identifier followed by a colon(:) that is applied to a statement or a block of code. A label can be used the break and continue to control the flow more precisely.

// Label with break
outerloop:
for (var i = 0; i < 5; i++) {
    console.log("Outerloop: " + i);
    innerloop:
    for (var j = 0; j < 5; j++){
       if (j > 3 ) break ; // Quit the innermost loop
       if (i == 2) break innerloop; // Do the same thing
       if (i == 4) break outerloop; // Quit the outer loop
       console.log("Innerloop: " + j);
    }
 }

 // Label with continue
 outerloop:
//  for (var i = 0; i <=)