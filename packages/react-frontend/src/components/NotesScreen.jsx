// function NotesScreen() {
//   return <h1>hello notes</h1>;
// }
// export default NotesScreen;

import { useState, useEffect } from "react";
import { NotesSidebar } from "./NotesSidebar";
import { NoteEditor } from "./NoteEditor";

function NotesScreen({
  notes = [],
  labels = [],
  activeNoteId = null,
  onSelectNote = () => {},
  onCreateNote = () => {},
  onDeleteNote = () => {},
  onCreateLabel = () => {},
  onDeleteLabel = () => {},
  onRenameLabel = () => {},
  onUpdateTitle = () => {},
  onUpdateContent = () => {},
  onUpdateLabel = () => {},
  onUpdateNote = () => {},
}) {
  const [mobileView, setMobileView] = useState("list");

  const activeNote = notes.find((n) => n.id === activeNoteId) ?? null;

  useEffect(() => {
    if (activeNoteId) {
      setMobileView("editor");
    } else {
      setMobileView("list");
    }
  }, [activeNoteId]);

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      <div
        className={[
          "flex-col h-full border-r bg-white",
          mobileView === "editor" ? "hidden lg:flex" : "flex w-full",
          "lg:flex lg:w-72 lg:shrink-0",
        ].join(" ")}
      >
        <NotesSidebar
          notes={notes}
          labels={labels}
          activeNoteId={activeNoteId}
          onSelectNote={onSelectNote}
          onCreateNote={onCreateNote}
          onDeleteNote={onDeleteNote}
          onCreateLabel={onCreateLabel}
          onDeleteLabel={onDeleteLabel}
          onRenameLabel={onRenameLabel}
        />
      </div>

      <div
        className={[
          "flex-col flex-1 h-full min-w-0",
          mobileView === "list" ? "hidden lg:flex" : "flex",
        ].join(" ")}
      >
        <NoteEditor
          note={activeNote}
          labels={labels}
          onUpdateTitle={onUpdateTitle}
          onUpdateContent={onUpdateContent}
          onUpdateLabel={onUpdateLabel}
          onUpdateNote={onUpdateNote}
          onBack={() => setMobileView("list")}
        />
      </div>
    </div>
  );
}

export default NotesScreen;

