const wouter = jest.createMockFromModule("wouter-preact");

let mockRoute;
function __setMockRoute(newMockRoute) {
  mockRoute = newMockRoute;
}

function __resetMocks() {
  mockRoute = undefined;
}

function useRoute() {
  return mockRoute || [false, {}];
}

wouter.__resetMocks = __resetMocks;
wouter.__setMockRoute = __setMockRoute;
wouter.useRoute = useRoute;

module.exports = wouter;
