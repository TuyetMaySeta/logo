"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  // const [lang, setLang] = React.useState(i18n.language || "en")
  const [lang, setLang] = React.useState("en")

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setLang(lng)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-32 justify-between">
          {lang === "en" ? "English" : "Tiếng Việt"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={lang} onValueChange={changeLanguage}>
          <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
          {/* <DropdownMenuRadioItem value="vi">Tiếng Việt</DropdownMenuRadioItem> */}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
