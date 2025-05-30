for file in src/shadcn/ui/*; do npx shadcn-vue@latest add --yes --overwrite $(basename "$file"); done
# for file in src/shadcn/ui/*; do echo $(basename "$file"); done