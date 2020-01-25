CHANGES=`git log origin/production..origin/master`;

if [ -z "$CHANGES" ]; then
  echo "✅ Production is already in sync with master";
  exit;
fi;

echo ""
echo ""
echo "📝 This is what's on master that's could be released to production:"
echo ""

git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr)%Creset' --abbrev-commit --date=relative origin/production..origin/master

echo ""
echo ""

while true; do
  read -p "🧐 Do you want to release what's on master to production? [yes/no] " yn
    case $yn in
        [Yy]es )
          git checkout production;
          git reset --hard origin/master;
          git push;
          git checkout -;
          echo "";
          echo "☀️  Production is in sync with master now. Keep at it 🚀!";
          break;;
        [Nn]o )
          echo "🤐 I did nothing.";
          exit;;
        * ) echo "🤬 Please answer yes or no.";;
    esac
done
