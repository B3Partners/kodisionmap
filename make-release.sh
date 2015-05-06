#!/bin/bash
FILES=(
	b3pmap.js
)

function changeVersionInFiles {
	CURVERSION=$VERSION
	PREVVERSION=$VERSION"-SNAPSHOT"

	echo "Verander versienummers in bestanden van versie" $PREVVERSION " naar versie" $CURVERSION

	for i in ${FILES[@]}; do
		echo "bestand: "${i}
		sed -i s/$PREVVERSION/$CURVERSION/g ${i}
	done

	echo "Einde veranderen bestanden";
}

function incrementVersionInFiles {
	MAJOR="${VERSION%.*}"
	MINOR="${VERSION##*.}"

	NEXTVERSION=$MAJOR.$((MINOR+1))-SNAPSHOT


	echo "Verhogen versienummers in bestanden van versie" $VERSION " naar versie" $NEXTVERSION
	
	for i in ${FILES[@]}; do
		echo "bestand: "${i}
		sed -i s/"Versie: "$VERSION/"Versie: "$NEXTVERSION/ ${i}
	done
	
}


if [ -z "$1" ]; then
	echo "Versie niet gegeven, stopt."
	exit 1;
fi

VERSION=$1;

echo "**********************************************************************"
echo ""
echo "Release maken: "$VERSION


echo "Eerdere release pogingen verwijderen..."
git checkout master
git branch -d release/v$VERSION
git branch -d v$VERSION
git push origin --delete release/v$VERSION
git push origin --delete v$VERSION
git reset HEAD --hard

echo "Start release:"
git checkout master
git pull --rebase

echo "Maak release branch:"
git checkout -b release/v$VERSION
#git push origin release/v$VERSION

changeVersionInFiles

git commit -am "Versie nummer bijgewerkt naar "$VERSION
#git push --set-upstream origin release/v$VERSION

echo "Maak release tag:"
git tag -f -a v$VERSION -m "Release versie $VERSION"
# git checkout v$VERSION
git push --tags

echo "Update de master met nieuwste versienummers:"
git checkout master

incrementVersionInFiles

git commit -am "Versienummer bijgewerkt"
git push

echo "Maak huidige branch de master:"
git checkout master

echo "einde"
