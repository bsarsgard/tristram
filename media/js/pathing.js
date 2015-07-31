  function findPath(fx, fy, tx, ty, findNeighbors, distanceFunction) {
    var current = null;
    var start = {x:fx, y:fy};
    var open = [];
    open.push({node: start, cost: 0});
    var came_from = [[]];
    var cost_so_far = [[]];
    came_from[start.y] = [];
    came_from[start.y][start.x] = null;
    cost_so_far[start.y] = [];
    cost_so_far[start.y][start.x] = 0;

    while (open.length > 0) {
      var iOpen = open.length, op, mc = null, best;
      // find the lowest heuristic value in open set
      while (iOpen--) {
        op = open[iOpen];
        if (mc === null || op.cost < mc) {
          mc = op.cost;
          best = iOpen;
        }
      }
      // get best node and remove it from open
      current = open[best].node;
      open.splice(best, 1);
      // check if we've finished
      if (current.x == tx && current.y == ty) {
        break;
      }
      // process neighbors
      var neighbors = findNeighbors(current.x, current.y), iNeighbor=neighbors.length, ne, new_cost, pri;
      while (iNeighbor--) {
        ne = neighbors[iNeighbor];
        new_cost = cost_so_far[current.y][current.x] + distanceFunction(current.x, current.y, ne.x, ne.y);
        if (cost_so_far[ne.y] === undefined || cost_so_far[ne.y][ne.x] === undefined || new_cost < cost_so_far[ne.y][ne.x]) {
          if (cost_so_far[ne.y] === undefined) {
            cost_so_far[ne.y] = [];
          }
          cost_so_far[ne.y][ne.x] = new_cost;
          pri = new_cost + distanceFunction(tx, ty, ne.x, ne.y);
          open.push({node: ne, cost: pri});
          if (came_from[ne.y] === undefined) {
            came_from[ne.y] = [];
          }
          came_from[ne.y][ne.x] = current;
        }
      }
    }

    // now trace back to the path
    current = {x:tx, y:ty};
    //path = [current];
    path = [];
    while (current.x != start.x || current.y != start.y) {
      path.push(current);
      current = came_from[current.y][current.x];
    }
    path.reverse();
    return path;
  }
