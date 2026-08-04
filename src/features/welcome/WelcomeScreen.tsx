import {
  Sparkles,
  FolderOpen,
  BookOpen,
  Database,
} from 'lucide-react';

import ActionCard from './ActionCard';

interface Props {
  onNewProject: () => void;
  onOpenProject: () => void;
  onLoadDemo: () => void;
}

export default function WelcomeScreen({
  onNewProject,
  onOpenProject,
  onLoadDemo,
}: Props) {
  return (
    <div
      className="
        relative
        flex
        h-screen
        items-center
        justify-center
        overflow-hidden

        bg-zinc-950
      "
    >
      {/* Background glow */}

      <div
        className="
          absolute
          inset-0

          bg-[radial-gradient(circle_at_top,#2563eb22,transparent_60%)]

          pointer-events-none
        "
      />

      {/* Grid */}

      <div
        className="
          absolute
          inset-0

          opacity-[0.05]

          [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]
          [background-size:40px_40px]
        "
      />

      {/* Main */}

      <div
        className="
          relative

          w-full
          max-w-6xl

          rounded-3xl

          border
          border-zinc-800

          bg-zinc-950/70

          p-14

          shadow-2xl

          backdrop-blur-xl
        "
      >
        {/* Header */}

        <div className="text-center">

          <div
            className="
              mx-auto

              mb-6

              flex
              h-20
              w-20

              items-center
              justify-center

              rounded-3xl

              bg-blue-500/10

              text-blue-400
            "
          >
            <Database size={42} />
          </div>

          <h1
            className="
              text-5xl
              font-bold
              tracking-tight

              text-white
            "
          >
            PrismaForge
          </h1>

          <p
            className="
              mt-3

              text-xl

              text-zinc-400
            "
          >
            Visual Prisma Schema Designer
          </p>

          <p
            className="
              mx-auto

              mt-6

              max-w-2xl

              text-base

              leading-8

              text-zinc-500
            "
          >
            Design relational databases visually,
            validate schemas,
            and generate production-ready
            Prisma models.
          </p>

        </div>

        {/* Cards */}

        <div
          className="
            mt-16

            grid

            grid-cols-3

            gap-6
          "
        >
          <ActionCard
            icon={<Sparkles size={24} />}
            title="New Project"
            description="Start designing your database from an empty canvas."
            onClick={onNewProject}
          />

          <ActionCard
            icon={<FolderOpen size={24} />}
            title="Open Project"
            description="Open an existing .prismaforge project."
            onClick={onOpenProject}
          />

          <ActionCard
            primary
            icon={<BookOpen size={24} />}
            title="Explore Demo"
            description="Load a complete e-commerce schema to explore PrismaForge."
            onClick={onLoadDemo}
          />
        </div>

        {/* Footer */}

        <div
          className="
            mt-14

            flex

            items-center

            justify-between

            border-t
            border-zinc-800

            pt-6

            text-sm

            text-zinc-500
          "
        >
          {/* <span>Ctrl + O • Open Project</span> */}

          <span>PrismaForge v1.0</span>
          <span>Created by Fariak123 
            <a className='text-blue-600 duration-150 hover:text-blue-400' href='https://github.com/Fariak123/PrismaForge'>{" [on github]"}</a>
          </span>
        </div>
      </div>
    </div>
  );
}