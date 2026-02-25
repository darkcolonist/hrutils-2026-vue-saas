import OpenBookIcon from "@/SvgIcons/OpenBookIcon";
import { Typography } from "@mui/material";

export default function WelcomeTile({ title, content }){
  let formattedContent = content;

  if(Array.isArray(content)){
    formattedContent = content.map((val, key) => <Typography paragraph key={key}>{val}</Typography>)
  }

  return <div className="scale-100
    p-6
    bg-white
    dark:bg-gray-800/50
    dark:bg-gradient-to-bl
    from-gray-700/50
    via-transparent
    dark:ring-1
    dark:ring-inset
    dark:ring-white/5
    rounded-lg
    shadow-2xl
    shadow-gray-500/20
    dark:shadow-none
    flex
    motion-safe:hover:scale-[1.01]
    transition-all
    duration-250
    focus:outline
    focus:outline-2
    focus:outline-red-500">
    <div>
      <div className="h-16 w-16 bg-red-50 dark:bg-red-800/20 flex items-center justify-center rounded-full">
        <OpenBookIcon sx={{ fontSize: 32 }} />
      </div>

      <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>

      <div className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
        {formattedContent}
      </div>
    </div>
  </div>
}