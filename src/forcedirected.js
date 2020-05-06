/**
 * A file to apply a force directed graph drawing algorithm
 * 
 * Most basic algorithm at core:
 *  1. Calculate Force on each vertex
 *  2. Move each vertex
 *  3. Repeat n times
 * This is inefficient but simple
 * 
 * More complicated algorithms alter both attractions / repulsive force
 * Some algorithms use Barnes-Hut simultion of distant forces to reduce time complexity
 */

 /*
Pseudocode:
  Take Graph:
    For M:
      For each node in graph:
        Calculate Forces:
          for links in node
            Force += c1 * log(link.length/c2)
          for other nodes in graph
            Force += c3 / nodes.distance^2
      move all vertices c4 * force on vertex      
 */

 /*
 Other thoughts:
 Forces have magnitude and direction. Direction is normalised vector between nodes. 
 When force is attractive, dir is node2.pos - node1.pos. When force is repulsive, dir is node1.pos-node2.pos
 */