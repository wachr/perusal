const mockFileSave = jest.fn().mockResolvedValue();
const mockFileOpen = jest.fn().mockResolvedValue("");

module.exports = {
  fileSave: mockFileSave,
  fileOpen: mockFileOpen,
};
