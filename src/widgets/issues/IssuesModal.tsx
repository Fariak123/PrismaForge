import {
  AlertTriangle,
} from "lucide-react";

import { useEffect } from "react";

import IssueMessage from "./IssueMessage";

import type {
  ValidationIssue,
} from "../../features/validation/validation.types";


interface Props {
  issues: ValidationIssue[];

  onClose: () => void;

  onContinue: () => void;

  onSelectTable: (
    id:string
  ) => void;

  onSelectColumn?: (
    tableId:string,
    columnId:string
  ) => void;
}


export default function IssuesModal({
  issues,
  onClose,
  onContinue,
  onSelectTable,
  onSelectColumn
}: Props) {


  useEffect(() => {

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {

      if (event.key === "Escape") {
        onClose();
      }

    };


    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };


  }, [onClose]);



  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/70
        backdrop-blur-sm
      "
      onMouseDown={onClose}
    >


      <div
        className="
          flex
          w-[520px]
          max-w-[90vw]
          flex-col
          overflow-hidden
          rounded-xl
          border
          border-zinc-800
          bg-zinc-950
          shadow-2xl
        "
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >


        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-zinc-800
            p-5
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <AlertTriangle
              size={22}
              className="text-yellow-400"
            />


            <div>

              <h2
                className="
                  font-semibold
                  text-white
                "
              >
                Schema Problems
              </h2>


              <p
                className="
                  text-xs
                  text-zinc-500
                "
              >
                {issues.length} issue
                {issues.length !== 1 && "s"}
                {" found"}
              </p>

            </div>

          </div>

        </div>



        {/* Issues list */}

        <div
          className="
            max-h-[400px]
            space-y-3
            overflow-y-auto
            p-5
          "
        >

          {issues.map((issue) => (

            <div
              key={issue.id}
              className="
                rounded-lg
                border
                border-zinc-800
                bg-zinc-900
                p-4
              "
            >

              <IssueMessage
                issue={issue}
                onClose={onClose}
                onSelectTable={onSelectTable}
                onSelectColumn={onSelectColumn}
              />

            </div>

          ))}

        </div>



        {/* Footer */}

        <div
          className="
            flex
            justify-end
            gap-3
            border-t
            border-zinc-800
            p-5
          "
        >

          <button
            onClick={onClose}
            className="
              rounded-lg
              border
              border-zinc-700
              px-4
              py-2
              text-sm
              text-zinc-300
              transition
              hover:bg-zinc-900
              hover:text-white
            "
          >
            Cancel
          </button>


          <button
            onClick={onContinue}
            className="
              rounded-lg
              bg-blue-600
              px-4
              py-2
              text-sm
              font-medium
              text-white
              transition
              hover:bg-blue-500
            "
          >
            Continue
          </button>


        </div>


      </div>

    </div>

  );
}