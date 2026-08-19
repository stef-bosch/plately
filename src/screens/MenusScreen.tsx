import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Icon } from '../components/BrandIcons';
import { FadeInView } from '../components/FadeInView';
import { MenuCard } from '../components/MenuCard';
import { getMenus } from '../data/menus';
import { useOpenMenu } from '../navigation/hooks';
import { colors, iconSize, radius, spacing, typography } from '../theme';

export function MenusScreen() {
  const openMenu = useOpenMenu();

  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const allMenus = useMemo(() => getMenus(), []);

  const filteredMenus = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q === '') return allMenus;
    return allMenus.filter((menu) => menu.title.toLowerCase().includes(q));
  }, [allMenus, query]);

  const countLabel = `${filteredMenus.length} ${
    filteredMenus.length === 1 ? 'menu' : "menu's"
  } gevonden`;

  const searchVisible = searchOpen || query.length > 0;

  return (
    <View style={styles.screen}>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.content}
        data={filteredMenus}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <FadeInView delay={Math.min(index, 6) * 55}>
            <MenuCard menu={item} onPress={() => openMenu(item.id)} />
          </FadeInView>
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Menu's</Text>
            <Text style={styles.subtitle}>{countLabel}</Text>

            <View style={styles.toolbar}>
              <Pressable
                onPress={() => setSearchOpen((open) => !open)}
                accessibilityRole="button"
                accessibilityState={{ expanded: searchVisible }}
                style={({ pressed }) => [
                  styles.toolbarButton,
                  searchVisible && styles.toolbarButtonActive,
                  pressed && styles.toolbarButtonPressed,
                ]}
              >
                <Icon name="Search" size={iconSize.action} color={colors.textSecondary} />
                <Text style={styles.toolbarButtonText}>Zoeken</Text>
              </Pressable>
            </View>

            {searchVisible ? (
              <View style={styles.searchBox}>
                <Icon name="Search" size={iconSize.action} color={colors.textMuted} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Zoek een menu..."
                  placeholderTextColor={colors.textMuted}
                  value={query}
                  onChangeText={setQuery}
                  returnKeyType="search"
                  autoFocus
                />
                <Ionicons
                  name="close-circle"
                  size={iconSize.action}
                  color={colors.textMuted}
                  onPress={() => {
                    setQuery('');
                    setSearchOpen(false);
                  }}
                />
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Geen menu's gevonden</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: 'hidden',
  },
  list: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.display,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: -spacing.sm,
  },
  toolbar: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  toolbarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toolbarButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  toolbarButtonPressed: {
    opacity: 0.85,
  },
  toolbarButtonText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    padding: 0,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
