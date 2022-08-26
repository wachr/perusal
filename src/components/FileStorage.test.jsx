import { h } from "preact";

import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import domPurify from "dompurify";

import FileStorage from "./FileStorage";

jest.mock("browser-fs-access");

describe(FileStorage.name, () => {
  const browserFsAccess = require("browser-fs-access");

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should use DOMPurify to sanitize state imported from a file", async () => {
    const fileText = '{\n\t"foo": "bar"\n}';
    const sanitizedFileText = fileText;
    const expectedNodeState = { foo: "bar" };

    const mockFileOpen = browserFsAccess.fileOpen.mockResolvedValueOnce({
      text: jest.fn().mockReturnValueOnce(fileText),
    });
    const spySanitize = jest
      .spyOn(domPurify, "sanitize")
      .mockReturnValueOnce(sanitizedFileText);
    const mockSetNode = jest.fn();

    render(<FileStorage nodeState={{}} setNode={mockSetNode} />);

    const importButton = screen.getByRole("button", { name: /import/i });
    fireEvent.click(importButton);
    await waitFor(() => expect(mockSetNode).toBeCalled());

    expect(mockFileOpen).toHaveBeenCalled;
    expect(spySanitize).toHaveBeenCalled;
    expect(mockSetNode).toHaveBeenCalledWith(expectedNodeState);
  });

  it("will write an export file for download", async () => {
    const nodeState = { foo: "bar" };
    const serializedState = '{\n\t"foo": "bar"\n}';

    const mockFileSave = browserFsAccess.fileSave.mockResolvedValueOnce();
    const mockBlob = jest.mock();
    jest.spyOn(global, "Blob").mockImplementation(function ([contents]) {
      expect(contents).toEqual(serializedState);
      return mockBlob;
    });

    render(<FileStorage nodeState={nodeState} setNode={jest.fn()} />);

    const exportButton = screen.getByRole("button", { name: /export/i });
    fireEvent.click(exportButton);
    await waitFor(() => expect(mockFileSave).toBeCalled());

    expect(mockFileSave).toHaveBeenCalledWith(mockBlob, {
      extensions: [".json"],
      fileName: "state.json",
    });
  });
});
