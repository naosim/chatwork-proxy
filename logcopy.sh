function renameIfExist() {
  if [ -f $1 ]; then
    mv $1 $2
  fi
}

filename="nohup.out"
renameIfExist "$filename.4" "$filename.5"
renameIfExist "$filename.3" "$filename.4"
renameIfExist "$filename.2" "$filename.3"
renameIfExist "$filename.1" "$filename.2"
renameIfExist "$filename" "$filename.1"
echo "">$filename
